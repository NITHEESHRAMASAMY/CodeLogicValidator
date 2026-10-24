package com.clv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String fullName;
    private String email;
    private boolean isEmailVerified;
    private String provider;
    private Set<String> roles;
    private String role;
    private String avatarUrl;
    private Integer currentStreak;
    private Integer longestStreak;
    private String lastSolvedDate;
}
