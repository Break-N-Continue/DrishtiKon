package com.drishti.kon.service;

import com.drishti.kon.dynamo.OtpItem;
import com.drishti.kon.repository.OtpRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
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

    public String generateAndSaveOtp(String email) {
        // Delete any existing OTP for this email first
        otpRepository.deleteByEmail(email);

        String otp = generateOtp();
        OffsetDateTime expiry = OffsetDateTime.now().plusMinutes(expiryMinutes);

        OtpItem item = new OtpItem();
        item.setEmail(email.toLowerCase().trim());
        item.setOtp(otp);
        item.setAttemptCount(0);
        item.setExpiryTime(expiry.toString());
        item.setExpiresAtTtl(expiry.toEpochSecond()); // DynamoDB TTL
        item.setCreatedAt(OffsetDateTime.now().toString());
        item.setPk(OtpItem.buildPk(email));
        item.setSk(OtpItem.SK_METADATA);

        otpRepository.save(item);
        log.debug("OTP generated for email={}", email);
        return otp;
    }

    public OtpValidationResult validateOtp(String email, String otp) {
        String normalizedEmail = email.toLowerCase().trim();

        Optional<OtpItem> optItem = otpRepository.findTopByEmailOrderByCreatedAtDesc(normalizedEmail);

        if (optItem.isEmpty()) {
            return OtpValidationResult.NOT_FOUND;
        }

        OtpItem item = optItem.get();

        // Check expiry
        OffsetDateTime expiryTime = OffsetDateTime.parse(item.getExpiryTime());
        if (expiryTime.isBefore(OffsetDateTime.now())) {
            otpRepository.deleteByEmail(normalizedEmail);
            return OtpValidationResult.EXPIRED;
        }

        // Check max attempts
        if (item.getAttemptCount() >= maxAttempts) {
            otpRepository.deleteByEmail(normalizedEmail);
            return OtpValidationResult.MAX_ATTEMPTS_EXCEEDED;
        }

        // Increment attempt count
        item.setAttemptCount(item.getAttemptCount() + 1);
        otpRepository.save(item);

        // Validate OTP
        if (!item.getOtp().equals(otp.trim())) {
            int remaining = maxAttempts - item.getAttemptCount();
            log.debug("Invalid OTP for email={}, {} attempts remaining", email, remaining);
            return OtpValidationResult.INVALID;
        }

        // OTP is valid — delete it
        otpRepository.deleteByEmail(normalizedEmail);
        log.info("OTP verified successfully for email={}", email);
        return OtpValidationResult.VALID;
    }

    /** No-op — DynamoDB TTL handles cleanup automatically. */
    public void cleanupExpired() {
        otpRepository.deleteExpired();
    }

    private String generateOtp() {
        int num = RANDOM.nextInt(900_000) + 100_000;
        return String.valueOf(num);
    }

    public enum OtpValidationResult {
        VALID, INVALID, EXPIRED, NOT_FOUND, MAX_ATTEMPTS_EXCEEDED
    }
}
