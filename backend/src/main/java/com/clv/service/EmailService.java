package com.clv.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    public void sendEmailVerification(String toEmail, String otpCode) {
        log.info("=================================================");
        log.info("EMAIL VERIFICATION OTP SENT TO: {}", toEmail);
        log.info("VERIFICATION CODE: [ {} ]", otpCode);
        log.info("=================================================");
    }

    public void sendPasswordResetOtp(String toEmail, String otpCode) {
        log.info("=================================================");
        log.info("PASSWORD RESET OTP SENT TO: {}", toEmail);
        log.info("RESET CODE: [ {} ]", otpCode);
        log.info("=================================================");
    }

    public void sendProblemRequestNotification(String adminEmail, String userEmail, String userName, String title, String description, String testCases, String category, String difficulty) {
        log.info("=================================================");
        log.info("NEW USER PROBLEM REQUEST DISPATCHED TO ADMIN: {}", adminEmail);
        log.info("SUBMITTED BY: {} ({})", userName, userEmail);
        log.info("PROBLEM TITLE: {}", title);
        log.info("CATEGORY: {} | DIFFICULTY: {}", category, difficulty);
        log.info("DESCRIPTION: {}", description);
        log.info("TEST CASES: {}", testCases);
        log.info("=================================================");
    }
}
