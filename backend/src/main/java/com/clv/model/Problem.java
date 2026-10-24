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
@Document(collection = "problems")
public class Problem {

    @Id
    private String id;

    @Indexed(unique = true)
    private Integer number;

    private String title;

    @Indexed(unique = true)
    private String slug;

    private String difficulty; // Easy, Intermediate, Hard

    private String category;

    private List<String> tags;

    private String acceptanceRate;

    private Integer points;

    private String description;

    private String inputFormat;

    private String outputFormat;

    private String constraints;

    private List<SampleCase> sampleCases;

    private List<String> hints;

    private List<String> expectedKeywords;

    @CreatedDate
    private Instant createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SampleCase {
        private String input;
        private String output;
    }
}
