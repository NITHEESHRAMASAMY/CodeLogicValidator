package com.clv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "classrooms")
public class Classroom {

    @Id
    private String id;

    private String name;

    private String code; // Unique 6-digit Private Room Code (e.g. CLV-784920)

    private String teacherEmail;

    private String teacherName;

    @Builder.Default
    private int capacity = 60; // Hard capped at 60 members

    @Builder.Default
    private List<Member> members = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Member {
        private String userId;
        private String name;
        private String role; // TEACHER, STUDENT
        private int points;
        private double accuracy;
        private String status;
    }
}
