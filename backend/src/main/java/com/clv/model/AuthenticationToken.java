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
@Document(collection = "auth_tokens")
public class AuthenticationToken {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String token; // OTP or UUID token string

    private TokenType type; // EMAIL_VERIFICATION, PASSWORD_RESET

    private Instant expiresAt;

    @Builder.Default
    private boolean isUsed = false;

    @CreatedDate
    private Instant createdAt;

    public enum TokenType {
        EMAIL_VERIFICATION,
        PASSWORD_RESET
    }
}
