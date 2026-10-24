package com.clv.service;

import com.clv.dto.response.UserDto;
import com.clv.model.User;
import com.clv.model.UserPreference;
import com.clv.repository.PreferenceRepository;
import com.clv.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;

    public UserDto mapToDto(User user) {
        boolean isAdmin = user.getRoles() != null && user.getRoles().contains("ROLE_ADMIN");
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .isEmailVerified(user.isEmailVerified())
                .provider(user.getProvider())
                .roles(user.getRoles())
                .role(isAdmin ? "ADMIN" : "USER")
                .avatarUrl(user.getAvatarUrl())
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .longestStreak(user.getLongestStreak() != null ? user.getLongestStreak() : 0)
                .lastSolvedDate(user.getLastSolvedDate())
                .build();
    }

    public UserPreference getUserPreferences(String userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseGet(() -> preferenceRepository.save(
                        UserPreference.builder().userId(userId).build()
                ));
    }

    public UserDto updateAvatar(String email, String avatarUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        user.setAvatarUrl(avatarUrl);
        User saved = userRepository.save(user);
        return mapToDto(saved);
    }
}

