package com.drishti.kon.service;

import com.drishti.kon.entity.OtpVerification;
import com.drishti.kon.repository.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final OtpRepository otpRepository;

    @Value("${app.otp.expiry-minutes}")
    private int expiryMinutes;

    @Value("${app.otp.max-attempts}")
    private int maxAttempts;

    public OtpService(OtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    @Transactional
    public String generateAndSaveOtp(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        String otp = generateOtp();

        OtpVerification verification = new OtpVerification();
        verification.setEmail(email.toLowerCase().trim());
        verification.setOtp(otp);
        verification.setExpiryTime(OffsetDateTime.now().plusMinutes(expiryMinutes));
        verification.setAttemptCount(0);

        otpRepository.save(verification);
        log.debug("OTP generated for email={}", email);

        return otp;
    }

    @Transactional
    public OtpValidationResult validateOtp(String email, String otp) {
        String normalizedEmail = email.toLowerCase().trim();

        Optional<OtpVerification> optVerification =
                otpRepository.findTopByEmailOrderByCreatedAtDesc(normalizedEmail);

        if (optVerification.isEmpty()) {
            return OtpValidationResult.NOT_FOUND;
        }

        OtpVerification verification = optVerification.get();

        // Check expiry
        if (verification.getExpiryTime().isBefore(OffsetDateTime.now())) {
            otpRepository.deleteByEmail(normalizedEmail);
            return OtpValidationResult.EXPIRED;
        }

        // Check max attempts
        if (verification.getAttemptCount() >= maxAttempts) {
            otpRepository.deleteByEmail(normalizedEmail);
            return OtpValidationResult.MAX_ATTEMPTS_EXCEEDED;
        }

        // Increment attempt count
        verification.setAttemptCount(verification.getAttemptCount() + 1);
        otpRepository.save(verification);

        // Validate OTP
        if (!verification.getOtp().equals(otp.trim())) {
            int remaining = maxAttempts - verification.getAttemptCount();
            log.debug("Invalid OTP for email={}, {} attempts remaining", email, remaining);
            return OtpValidationResult.INVALID;
        }

        // OTP is valid — delete it
        otpRepository.deleteByEmail(normalizedEmail);
        log.info("OTP verified successfully for email={}", email);
        return OtpValidationResult.VALID;
    }

    @Transactional
    public void cleanupExpired() {
        otpRepository.deleteExpired(OffsetDateTime.now());
    }

    private String generateOtp() {
        int num = RANDOM.nextInt(900_000) + 100_000; // 100000-999999
        return String.valueOf(num);
    }

    public enum OtpValidationResult {
        VALID,
        INVALID,
        EXPIRED,
        NOT_FOUND,
        MAX_ATTEMPTS_EXCEEDED
    }
}
