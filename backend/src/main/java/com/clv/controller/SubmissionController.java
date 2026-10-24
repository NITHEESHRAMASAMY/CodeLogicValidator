package com.clv.controller;

import com.clv.dto.response.ApiResponse;
import com.clv.model.Submission;
import com.clv.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    public ResponseEntity<ApiResponse> getUserSubmissions(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "anonymous_user";
        List<Submission> submissions = submissionService.getUserSubmissions(userId);
        return ResponseEntity.ok(ApiResponse.ok("User submissions retrieved", submissions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getSubmissionById(@PathVariable String id) {
        Submission submission = submissionService.getSubmissionById(id);
        if (submission == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Submission not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Submission retrieved", submission));
    }
}
