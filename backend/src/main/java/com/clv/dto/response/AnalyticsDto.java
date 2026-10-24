package com.clv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDto {
    private Integer totalSubmissions;
    private Integer passedSubmissions;
    private Integer accuracyPercentage;
    private Integer streakDays;
    private Integer totalPoints;
    private String currentBadge;
    private Map<String, Integer> difficultyBreakdown;
    private Map<String, Integer> dailyHeatmap;
}
