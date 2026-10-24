package com.clv.controller;

import com.clv.dto.response.ApiResponse;
import com.clv.dto.response.UserDto;
import com.clv.model.UserPreference;
import com.clv.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse> getPreferences(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        UserPreference preference = userService.getUserPreferences(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("User preferences retrieved", preference));
    }

    @PutMapping("/avatar")
    public ResponseEntity<ApiResponse> updateAvatar(@RequestBody Map<String, String> payload, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        String avatarUrl = payload != null ? payload.get("avatarUrl") : null;
        UserDto updatedUser = userService.updateAvatar(authentication.getName(), avatarUrl);
        return ResponseEntity.ok(ApiResponse.ok("Avatar updated successfully", updatedUser));
    }
}
