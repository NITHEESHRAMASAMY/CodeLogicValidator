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
@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    private String action; // CREATE_PROBLEM, UPDATE_PROBLEM, DELETE_PROBLEM, SYSTEM_BOOT

    private String adminEmail;

    private String details;

    private String ipAddress;

    @CreatedDate
    private Instant createdAt;
}
