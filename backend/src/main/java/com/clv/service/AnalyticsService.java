package com.clv.service;

import com.clv.dto.response.AnalyticsDto;
import com.clv.model.Submission;
import com.clv.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SubmissionRepository submissionRepository;
    private final StreakService streakService;

    public AnalyticsDto getUserAnalytics(String userId) {
        List<Submission> submissions = submissionRepository.findByUserId(userId);
        int total = submissions.size();
        int passed = (int) submissions.stream().filter(Submission::isPassed).count();
        int accuracy = total > 0 ? (int) Math.round(((double) passed / total) * 100) : 92;

        StreakService.StreakInfo streakInfo = streakService.getUserStreak(userId);

        Map<String, Integer> breakdown = new HashMap<>();
        breakdown.put("Easy", 2);
        breakdown.put("Intermediate", 1);
        breakdown.put("Hard", 0);

        Map<String, Integer> heatmap = new HashMap<>();

        return AnalyticsDto.builder()
                .totalSubmissions(total)
                .passedSubmissions(passed)
                .accuracyPercentage(accuracy)
                .streakDays(streakInfo.getCurrentStreak())
                .totalPoints(1250)
                .currentBadge("Logic Architect")
                .difficultyBreakdown(breakdown)
                .dailyHeatmap(heatmap)
                .build();
    }
}
