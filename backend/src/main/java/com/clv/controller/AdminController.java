package com.clv.controller;

import com.clv.dto.response.ApiResponse;
import com.clv.model.AuditLog;
import com.clv.model.Problem;
import com.clv.model.ProblemRequest;
import com.clv.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    private void checkAdminAccess(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication required. Admin privileges needed.");
        }
        String callerEmail = authentication.getName().toLowerCase().trim();
        boolean hasAdminRole = authentication.getAuthorities() != null && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equalsIgnoreCase("ROLE_ADMIN"));

        if (!AdminService.ADMIN_EMAIL.equalsIgnoreCase(callerEmail) && !hasAdminRole) {
            throw new AccessDeniedException("Access denied. Admin module is strictly restricted to " + AdminService.ADMIN_EMAIL);
        }
    }

    @PostMapping("/problems")
    public ResponseEntity<ApiResponse> saveProblem(
            Authentication authentication,
            @RequestBody Problem problem) {
        checkAdminAccess(authentication);
        Problem saved = adminService.saveProblem(problem, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Problem saved successfully", saved));
    }

    @PostMapping("/problems/batch")
    public ResponseEntity<ApiResponse> saveProblemsBatch(
            Authentication authentication,
            @RequestBody List<Problem> problems) {
        checkAdminAccess(authentication);
        List<Problem> saved = adminService.saveProblemsBatch(problems, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Batch uploaded " + saved.size() + " problems successfully", saved));
    }

    @DeleteMapping("/problems/{id}")
    public ResponseEntity<ApiResponse> deleteProblem(
            Authentication authentication,
            @PathVariable String id) {
        checkAdminAccess(authentication);
        adminService.deleteProblem(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Problem deleted successfully"));
    }

    @GetMapping("/problem-requests")
    public ResponseEntity<ApiResponse> getProblemRequests(Authentication authentication) {
        checkAdminAccess(authentication);
        List<ProblemRequest> requests = adminService.getProblemRequests();
        return ResponseEntity.ok(ApiResponse.ok("Problem requests retrieved", requests));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse> getAuditLogs(Authentication authentication) {
        checkAdminAccess(authentication);
        List<AuditLog> logs = adminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.ok("Audit logs retrieved", logs));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.error(ex.getMessage()));
    }
}
