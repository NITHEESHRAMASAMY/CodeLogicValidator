package com.clv.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user_preferences")
public class UserPreference {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    @Builder.Default
    private String theme = "LUXURY_DARK";

    @Builder.Default
    private boolean notificationsEnabled = true;

    @Builder.Default
    private String defaultCodeLanguage = "JAVA";

    @Builder.Default
    private int fontSize = 14;

    @Builder.Default
    private boolean autoFormatCode = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
