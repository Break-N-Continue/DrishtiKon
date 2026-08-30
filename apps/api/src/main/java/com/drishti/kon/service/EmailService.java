package com.drishti.kon.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Email delivery is disabled.
 * OTPs are saved to DynamoDB and can be retrieved from the AWS Console / CLI for testing.
 * Re-enable by injecting JavaMailSender and calling SES SMTP when email is needed.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void sendOtpEmail(String toEmail, String otp) {
        // No-op: email sending removed. OTP is persisted in DynamoDB.
        log.info("[DEV] OTP for {} → {} (email sending disabled)", toEmail, otp);
    }
}
