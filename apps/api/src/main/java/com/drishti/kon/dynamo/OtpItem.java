package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * DynamoDB item representing an OTP verification record.
 *
 * Key design:
 *   PK  = OTP#<email>
 *   SK  = METADATA
 *
 * TTL: {@code expiresAtTtl} is a Unix epoch second. DynamoDB's native TTL
 * will auto-delete OTP records when they expire — completely replacing
 * the SQL-based {@code otpRepository.deleteExpired()} cron call.
 */
@DynamoDbBean
public class OtpItem {

    private String pk;
    private String sk;

    private String email;
    private String otp;
    private Integer attemptCount;
    private String expiryTime;   // ISO-8601 (for validation logic)
    private Long expiresAtTtl;   // Unix epoch seconds (DynamoDB TTL attribute)
    private String createdAt;

    // ── Key accessors ─────────────────────────────────────────────────────────

    @DynamoDbPartitionKey
    @DynamoDbAttribute("PK")
    public String getPk() { return pk; }
    public void setPk(String pk) { this.pk = pk; }

    @DynamoDbSortKey
    @DynamoDbAttribute("SK")
    public String getSk() { return sk; }
    public void setSk(String sk) { this.sk = sk; }

    // ── Attribute accessors ───────────────────────────────────────────────────

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }

    public String getExpiryTime() { return expiryTime; }
    public void setExpiryTime(String expiryTime) { this.expiryTime = expiryTime; }

    public Long getExpiresAtTtl() { return expiresAtTtl; }
    public void setExpiresAtTtl(Long expiresAtTtl) { this.expiresAtTtl = expiresAtTtl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    // ── Factory helpers ───────────────────────────────────────────────────────

    public static String buildPk(String email) {
        return "OTP#" + email.toLowerCase();
    }

    public static final String SK_METADATA = "METADATA";
}
