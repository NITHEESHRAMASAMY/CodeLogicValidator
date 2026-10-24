package com.clv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponse {
    private boolean passed;
    private Integer stars;
    private Integer score;
    private String summary;
    private List<StepFeedbackDto> feedback;
    private List<String> hints;
    private Integer currentStreak;
    private String lastSolvedDate;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StepFeedbackDto {
        private String step;
        private String status; // PASS, WARN, FAIL
        private String detail;
    }
}
