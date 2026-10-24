package com.clv.service;

import com.clv.model.User;
import com.clv.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class StreakServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StreakService streakService;

    private User testUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = User.builder()
                .id("test-user-id")
                .email("test.student@clv.io")
                .currentStreak(0)
                .longestStreak(0)
                .lastSolvedDate(null)
                .build();

        when(userRepository.findByEmail("test.student@clv.io")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    @DisplayName("Monday attendance initiates streak of 1")
    void testInitialSolve() {
        StreakService.StreakInfo info = streakService.recordSuccessfulSolve("test.student@clv.io");
        assertEquals(1, info.getCurrentStreak());
        assertTrue(info.isActive());
        assertEquals(LocalDate.now().toString(), info.getLastSolvedDate());
    }

    @Test
    @DisplayName("Consecutive day solve increments streak (e.g., Monday -> Tuesday: streak becomes 2)")
    void testConsecutiveSolve() {
        // Solved yesterday
        testUser.setCurrentStreak(1);
        testUser.setLastSolvedDate(LocalDate.now().minusDays(1).toString());

        StreakService.StreakInfo info = streakService.recordSuccessfulSolve("test.student@clv.io");
        assertEquals(2, info.getCurrentStreak());
        assertEquals(2, info.getLongestStreak());
    }

    @Test
    @DisplayName("Missed day resets streak to 0 (e.g., solved Tuesday, missed Wednesday, checked on Thursday)")
    void testMissedDayStreakTurnsToZero() {
        // Solved 2 days ago (missed yesterday)
        testUser.setCurrentStreak(2);
        testUser.setLastSolvedDate(LocalDate.now().minusDays(2).toString());

        StreakService.StreakInfo info = streakService.getUserStreak("test.student@clv.io");
        assertEquals(0, info.getCurrentStreak());
        assertFalse(info.isActive());
        assertEquals(0, testUser.getCurrentStreak());
    }

    @Test
    @DisplayName("Solving after missed day restarts streak at 1 (e.g., missed Wednesday, solved Thursday)")
    void testSolveAfterMissedDayRestartsAtOne() {
        // Solved 2 days ago (missed yesterday)
        testUser.setCurrentStreak(2);
        testUser.setLastSolvedDate(LocalDate.now().minusDays(2).toString());

        StreakService.StreakInfo info = streakService.recordSuccessfulSolve("test.student@clv.io");
        assertEquals(1, info.getCurrentStreak());
        assertTrue(info.isActive());
        assertEquals(LocalDate.now().toString(), info.getLastSolvedDate());
    }
}
