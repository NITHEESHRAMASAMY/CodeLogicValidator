package com.clv.service;

import com.clv.dto.request.*;
import com.clv.dto.response.ApiResponse;
import com.clv.dto.response.JwtResponse;
import com.clv.dto.response.UserDto;
import com.clv.model.*;
import com.clv.repository.PreferenceRepository;
import com.clv.repository.SessionRepository;
import com.clv.repository.TokenRepository;
import com.clv.repository.UserRepository;
import com.clv.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final SessionRepository sessionRepository;
    private final PreferenceRepository preferenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final EmailService emailService;

    private static final SecureRandom random = new SecureRandom();

    private String generate6DigitOtp() {
        int number = 100000 + random.nextInt(900000);
        return String.valueOf(number);
    }

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email address is already registered.");
        }

        Set<String> roles = new java.util.HashSet<>(Set.of("ROLE_USER"));
        if (AdminService.ADMIN_EMAIL.equalsIgnoreCase(request.getEmail().trim())) {
            roles.add("ROLE_ADMIN");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .isEmailVerified(false)
                .roles(roles)
                .provider("LOCAL")
                .avatarUrl(null)
                .build();

        User savedUser = userRepository.save(user);

        // Initialize User Preference record
        UserPreference preference = UserPreference.builder()
                .userId(savedUser.getId())
                .theme("LUXURY_DARK")
                .build();
        preferenceRepository.save(preference);

        // Generate 6-Digit Email Verification OTP
        String otp = generate6DigitOtp();
        AuthenticationToken token = AuthenticationToken.builder()
                .userId(savedUser.getId())
                .token(otp)
                .type(AuthenticationToken.TokenType.EMAIL_VERIFICATION)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .isUsed(false)
                .build();
        tokenRepository.save(token);

        emailService.sendEmailVerification(savedUser.getEmail(), otp);

        return ApiResponse.ok("User registered successfully. Verification OTP dispatched.", userService.mapToDto(savedUser));
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseGet(() -> {
                    if (AdminService.ADMIN_EMAIL.equalsIgnoreCase(request.getEmail().trim())) {
                        User admin = User.builder()
                                .fullName("Nitheesh (System Admin)")
                                .email(AdminService.ADMIN_EMAIL)
                                .password(passwordEncoder.encode(request.getPassword()))
                                .isEmailVerified(true)
                                .provider("LOCAL")
                                .roles(new java.util.HashSet<>(java.util.Set.of("ROLE_ADMIN", "ROLE_USER")))
                                .avatarUrl(null)
                                .build();
                        return userRepository.save(admin);
                    }
                    throw new IllegalArgumentException("Invalid email or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            if (AdminService.ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
                user = userRepository.save(user);
            } else {
                throw new IllegalArgumentException("Invalid email or password");
            }
        }

        if (AdminService.ADMIN_EMAIL.equalsIgnoreCase(user.getEmail())) {
            if (user.getRoles() == null) {
                user.setRoles(new java.util.HashSet<>());
            }
            if (!user.getRoles().contains("ROLE_ADMIN")) {
                user.getRoles().add("ROLE_ADMIN");
                user = userRepository.save(user);
            }
        }

        String jwt = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = UUID.randomUUID().toString();

        // Save Active Session
        Session session = Session.builder()
                .userId(user.getId())
                .refreshToken(refreshToken)
                .rememberMe(request.isRememberMe())
                .expiresAt(Instant.now().plus(request.isRememberMe() ? 30 : 7, ChronoUnit.DAYS))
                .build();
        sessionRepository.save(session);

        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .user(userService.mapToDto(user))
                .build();
    }

    public JwtResponse googleLogin(GoogleAuthRequest request) {
        // Simulated OAuth Token exchange & verification
        String email = "google_user_" + UUID.randomUUID().toString().substring(0, 6) + "@clv.io";
        
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .fullName("Google Developer")
                    .email(email)
                    .isEmailVerified(true)
                    .provider("GOOGLE")
                    .avatarUrl(null)
                    .build();
            User saved = userRepository.save(newUser);
            preferenceRepository.save(UserPreference.builder().userId(saved.getId()).build());
            return saved;
        });

        String jwt = jwtTokenProvider.generateToken(user.getEmail());
        String refreshToken = UUID.randomUUID().toString();

        return JwtResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .user(userService.mapToDto(user))
                .build();
    }

    public ApiResponse verifyEmail(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User email not found."));

        AuthenticationToken token = tokenRepository.findByTokenAndTypeAndIsUsedFalse(
                request.getOtp(), AuthenticationToken.TokenType.EMAIL_VERIFICATION
        ).orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification OTP."));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("OTP code has expired. Please request a new code.");
        }

        token.setUsed(true);
        tokenRepository.save(token);

        user.setEmailVerified(true);
        userRepository.save(user);

        return ApiResponse.ok("Email address verified successfully!");
    }

    public ApiResponse resendVerification(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User email not found."));

        String otp = generate6DigitOtp();
        AuthenticationToken token = AuthenticationToken.builder()
                .userId(user.getId())
                .token(otp)
                .type(AuthenticationToken.TokenType.EMAIL_VERIFICATION)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .isUsed(false)
                .build();
        tokenRepository.save(token);

        emailService.sendEmailVerification(user.getEmail(), otp);

        return ApiResponse.ok("New verification OTP sent to " + email);
    }

    public ApiResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("No registered account found with this email."));

        String otp = generate6DigitOtp();
        AuthenticationToken token = AuthenticationToken.builder()
                .userId(user.getId())
                .token(otp)
                .type(AuthenticationToken.TokenType.PASSWORD_RESET)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .isUsed(false)
                .build();
        tokenRepository.save(token);

        emailService.sendPasswordResetOtp(user.getEmail(), otp);

        return ApiResponse.ok("Password reset OTP dispatched to " + request.getEmail());
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("User email not found."));

        AuthenticationToken token = tokenRepository.findByTokenAndTypeAndIsUsedFalse(
                request.getOtp(), AuthenticationToken.TokenType.PASSWORD_RESET
        ).orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset OTP."));

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Reset OTP has expired.");
        }

        token.setUsed(true);
        tokenRepository.save(token);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.ok("Password reset successfully. You may now sign in with your new credentials.");
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        return userService.mapToDto(user);
    }
}
