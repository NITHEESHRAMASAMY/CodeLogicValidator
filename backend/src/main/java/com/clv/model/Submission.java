package com.clv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "submissions")
public class Submission {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String problemId;

    private String logicText;

    private boolean passed;

    private Integer stars;

    private Integer score;

    private String summary;

    private List<StepFeedback> feedback;

    private List<String> hintsProvided;

    @CreatedDate
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepFeedback {
        private String step;
        private String status; // PASS, WARN, FAIL
        private String detail;
    }
}
