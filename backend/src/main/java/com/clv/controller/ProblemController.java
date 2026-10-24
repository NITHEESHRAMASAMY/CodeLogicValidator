package com.clv.controller;

import com.clv.dto.response.ApiResponse;
import com.clv.model.Problem;
import com.clv.model.ProblemRequest;
import com.clv.service.AdminService;
import com.clv.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemService problemService;
    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProblems() {
        List<Problem> problems = problemService.getAllProblems();
        return ResponseEntity.ok(ApiResponse.ok("Problems retrieved successfully", problems));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProblemById(@PathVariable String id) {
        Problem problem = problemService.getProblemById(id);
        if (problem == null) {
            return ResponseEntity.status(404).body(ApiResponse.error("Problem not found"));
        }
        return ResponseEntity.ok(ApiResponse.ok("Problem retrieved", problem));
    }

    @PostMapping("/request")
    public ResponseEntity<ApiResponse> requestProblem(
            Authentication authentication,
            @RequestBody ProblemRequest request) {
        if (authentication != null && authentication.isAuthenticated()) {
            if (request.getUserEmail() == null || request.getUserEmail().isBlank()) {
                request.setUserEmail(authentication.getName());
            }
        }
        ProblemRequest saved = adminService.submitProblemRequest(request);
        return ResponseEntity.ok(ApiResponse.ok("Problem request dispatched to Admin (" + AdminService.ADMIN_EMAIL + ")", saved));
    }
}
