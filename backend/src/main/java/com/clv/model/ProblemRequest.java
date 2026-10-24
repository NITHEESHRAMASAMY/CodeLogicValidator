package com.clv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "problem_requests")
public class ProblemRequest {

    @Id
    private String id;

    private String userEmail;
    private String userName;
    private String title;
    private String category;
    private String difficulty;
    private String description;
    private String testCases;

    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, ADDED

    @CreatedDate
    private Instant createdAt;
}
