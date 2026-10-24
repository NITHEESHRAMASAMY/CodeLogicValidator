package com.clv.controller;

import com.clv.dto.response.AnalyticsDto;
import com.clv.dto.response.ApiResponse;
import com.clv.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final com.clv.service.StreakService streakService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getAnalyticsSummary(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "anonymous_user";
        AnalyticsDto summary = analyticsService.getUserAnalytics(userId);
        return ResponseEntity.ok(ApiResponse.ok("Analytics summary retrieved", summary));
    }

    @GetMapping("/streak")
    public ResponseEntity<ApiResponse> getUserStreak(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "anonymous_user";
        com.clv.service.StreakService.StreakInfo streak = streakService.getUserStreak(userId);
        return ResponseEntity.ok(ApiResponse.ok("User streak retrieved", streak));
    }
}
