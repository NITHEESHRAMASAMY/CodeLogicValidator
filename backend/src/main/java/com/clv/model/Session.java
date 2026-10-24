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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed(unique = true)
    private String refreshToken;

    private String ipAddress;

    private String userAgent;

    private boolean rememberMe;

    private Instant expiresAt;

    @CreatedDate
    private Instant createdAt;
}
