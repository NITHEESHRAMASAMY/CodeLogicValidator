package com.clv.service;

import com.clv.model.AuditLog;
import com.clv.model.Problem;
import com.clv.model.ProblemRequest;
import com.clv.model.User;
import com.clv.repository.AuditLogRepository;
import com.clv.repository.ProblemRepository;
import com.clv.repository.ProblemRequestRepository;
import com.clv.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    public static final String ADMIN_EMAIL = "nitheesh25bls@gmail.com";

    private final ProblemRepository problemRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final ProblemRequestRepository problemRequestRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedAdminAccount() {
        Optional<User> existingUser = userRepository.findByEmail(ADMIN_EMAIL);
        if (existingUser.isEmpty()) {
            User admin = User.builder()
                    .fullName("Nitheesh (System Admin)")
                    .email(ADMIN_EMAIL)
                    .password(passwordEncoder.encode("Admin@123"))
                    .isEmailVerified(true)
                    .provider("LOCAL")
                    .roles(new HashSet<>(Set.of("ROLE_ADMIN", "ROLE_USER")))
                    .avatarUrl(null)
                    .build();

            userRepository.save(admin);
            log.info("Primary Administrator account seeded: {}", ADMIN_EMAIL);
            recordAudit("SEED_ADMIN", ADMIN_EMAIL, "Dedicated primary administrator account initialized: " + ADMIN_EMAIL);
        } else {
            User admin = existingUser.get();
            if (admin.getRoles() == null) {
                admin.setRoles(new HashSet<>());
            }
            if (!admin.getRoles().contains("ROLE_ADMIN")) {
                admin.getRoles().add("ROLE_ADMIN");
                userRepository.save(admin);
                log.info("Granted ROLE_ADMIN to existing administrator account: {}", ADMIN_EMAIL);
            }
        }
    }

    public Problem saveProblem(Problem problem, String adminEmail) {
        boolean isNew = problem.getId() == null || !problemRepository.existsById(problem.getId());
        Problem saved = problemRepository.save(problem);

        recordAudit(isNew ? "CREATE_PROBLEM" : "UPDATE_PROBLEM", adminEmail,
                (isNew ? "Created new problem: " : "Updated problem: ") + saved.getTitle());

        return saved;
    }

    public List<Problem> saveProblemsBatch(List<Problem> problems, String adminEmail) {
        if (problems == null || problems.isEmpty()) {
            return problemRepository.findAll();
        }
        for (Problem p : problems) {
            if (p.getId() != null && problemRepository.existsById(p.getId())) {
                problemRepository.save(p);
            } else if (p.getNumber() != null && problemRepository.findByNumber(p.getNumber()).isPresent()) {
                Problem existing = problemRepository.findByNumber(p.getNumber()).get();
                p.setId(existing.getId());
                problemRepository.save(p);
            } else if (p.getSlug() != null && problemRepository.findBySlug(p.getSlug()).isPresent()) {
                Problem existing = problemRepository.findBySlug(p.getSlug()).get();
                p.setId(existing.getId());
                problemRepository.save(p);
            } else {
                problemRepository.save(p);
            }
        }
        recordAudit("BATCH_UPLOAD_PROBLEMS", adminEmail, "Uploaded/Synchronized " + problems.size() + " problems into MongoDB.");
        return problemRepository.findAll();
    }

    public void deleteProblem(String problemId, String adminEmail) {
        problemRepository.deleteById(problemId);
        recordAudit("DELETE_PROBLEM", adminEmail, "Deleted problem with ID: " + problemId);
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }

    public ProblemRequest submitProblemRequest(ProblemRequest request) {
        ProblemRequest saved = problemRequestRepository.save(request);
        emailService.sendProblemRequestNotification(
                ADMIN_EMAIL,
                request.getUserEmail(),
                request.getUserName(),
                request.getTitle(),
                request.getDescription(),
                request.getTestCases(),
                request.getCategory(),
                request.getDifficulty()
        );
        recordAudit("PROBLEM_REQUEST_RECEIVED", request.getUserEmail(),
                "New problem proposal submitted to Admin: " + request.getTitle());
        return saved;
    }

    public List<ProblemRequest> getProblemRequests() {
        return problemRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public void recordAudit(String action, String adminEmail, String details) {
        AuditLog logEntry = AuditLog.builder()
                .action(action)
                .adminEmail(adminEmail)
                .details(details)
                .build();
        auditLogRepository.save(logEntry);
    }
}
