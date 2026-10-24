package com.clv.service;

import com.clv.model.User;
import com.clv.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserRepository userRepository;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StreakInfo {
        private int currentStreak;
        private int longestStreak;
        private String lastSolvedDate;
        private boolean active;
        private int consistencyGoal;
    }

    /**
     * Retrieves the current daily streak for a user, automatically executing
     * consecutive-day validation rules on the backend.
     *
     * Rule:
     * - If user missed a calendar day (daysDiff > 1), streak turns to 0.
     * - If user solved today or yesterday, active streak is preserved.
     */
    public StreakInfo getUserStreak(String userEmailOrId) {
        Optional<User> userOpt = findUser(userEmailOrId);
        if (userOpt.isEmpty()) {
            return StreakInfo.builder()
                    .currentStreak(0)
                    .longestStreak(0)
                    .lastSolvedDate(null)
                    .active(false)
                    .consistencyGoal(7)
                    .build();
        }

        User user = userOpt.get();
        validateAndSyncStreak(user);

        int current = user.getCurrentStreak() != null ? user.getCurrentStreak() : 0;
        int longest = user.getLongestStreak() != null ? user.getLongestStreak() : 0;
        boolean isActive = current > 0;

        return StreakInfo.builder()
                .currentStreak(current)
                .longestStreak(longest)
                .lastSolvedDate(user.getLastSolvedDate())
                .active(isActive)
                .consistencyGoal(7)
                .build();
    }

    /**
     * Executes backend consecutive-day rules upon a successful logic solution.
     *
     * Rules:
     * 1. If solved for the first time -> streak = 1.
     * 2. If solved again on the same day -> streak maintained.
     * 3. If solved on consecutive day (e.g., Monday -> Tuesday) -> streak = currentStreak + 1.
     * 4. If a calendar day was missed (e.g., missed Wednesday, solving Thursday) -> streak restarts at 1.
     */
    public StreakInfo recordSuccessfulSolve(String userEmailOrId) {
        Optional<User> userOpt = findUser(userEmailOrId);
        if (userOpt.isEmpty()) {
            return StreakInfo.builder()
                    .currentStreak(1)
                    .longestStreak(1)
                    .lastSolvedDate(LocalDate.now().toString())
                    .active(true)
                    .consistencyGoal(7)
                    .build();
        }

        User user = userOpt.get();
        LocalDate today = LocalDate.now();
        int newStreak = 1;

        if (user.getLastSolvedDate() == null || user.getLastSolvedDate().isBlank()) {
            newStreak = 1;
        } else {
            try {
                LocalDate lastDate = LocalDate.parse(user.getLastSolvedDate());
                long daysDiff = ChronoUnit.DAYS.between(lastDate, today);

                if (daysDiff == 0) {
                    // Solved again today: maintain existing active streak
                    newStreak = Math.max(1, user.getCurrentStreak() != null ? user.getCurrentStreak() : 1);
                } else if (daysDiff == 1) {
                    // Consecutive day (e.g., Monday -> Tuesday): increment streak!
                    newStreak = (user.getCurrentStreak() != null ? user.getCurrentStreak() : 0) + 1;
                } else {
                    // Missed day (e.g., missed Wednesday, solved Thursday): restart at 1!
                    newStreak = 1;
                }
            } catch (Exception e) {
                log.warn("Failed to parse lastSolvedDate '{}', resetting streak to 1", user.getLastSolvedDate());
                newStreak = 1;
            }
        }

        user.setCurrentStreak(newStreak);
        user.setLastSolvedDate(today.toString());

        int prevLongest = user.getLongestStreak() != null ? user.getLongestStreak() : 0;
        int updatedLongest = Math.max(prevLongest, newStreak);
        user.setLongestStreak(updatedLongest);

        int totalSolved = user.getTotalSolved() != null ? user.getTotalSolved() + 1 : 1;
        user.setTotalSolved(totalSolved);

        userRepository.save(user);

        log.info("Streak updated on backend for user '{}': currentStreak={}, lastSolvedDate={}",
                user.getEmail(), newStreak, today);

        return StreakInfo.builder()
                .currentStreak(newStreak)
                .longestStreak(updatedLongest)
                .lastSolvedDate(today.toString())
                .active(true)
                .consistencyGoal(7)
                .build();
    }

    /**
     * Checks if the streak has lapsed due to a missed day and resets it to 0.
     */
    private void validateAndSyncStreak(User user) {
        if (user.getLastSolvedDate() == null || user.getLastSolvedDate().isBlank()) {
            if (user.getCurrentStreak() != null && user.getCurrentStreak() > 0) {
                user.setCurrentStreak(0);
                userRepository.save(user);
            }
            return;
        }

        try {
            LocalDate lastDate = LocalDate.parse(user.getLastSolvedDate());
            LocalDate today = LocalDate.now();
            long daysDiff = ChronoUnit.DAYS.between(lastDate, today);

            // If more than 1 day elapsed without solving (e.g., solved Tuesday, today is Thursday):
            // Wednesday was missed -> streak turns to 0!
            if (daysDiff > 1) {
                if (user.getCurrentStreak() != null && user.getCurrentStreak() > 0) {
                    log.info("Streak expired for user '{}' (last solved {}, today {}). Resetting streak to 0.",
                            user.getEmail(), lastDate, today);
                    user.setCurrentStreak(0);
                    userRepository.save(user);
                }
            }
        } catch (Exception e) {
            log.warn("Error checking streak expiration for user {}: {}", user.getEmail(), e.getMessage());
        }
    }

    private Optional<User> findUser(String userEmailOrId) {
        if (userEmailOrId == null || userEmailOrId.isBlank()) {
            return Optional.empty();
        }
        Optional<User> byEmail = userRepository.findByEmail(userEmailOrId.toLowerCase().trim());
        if (byEmail.isPresent()) return byEmail;
        return userRepository.findById(userEmailOrId);
    }
}
