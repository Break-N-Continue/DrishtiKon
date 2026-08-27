package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

import java.time.Instant;

/**
 * DynamoDB item representing a User account.
 *
 * Single-table key design:
 *   PK  = USER#<email>       (email is the natural unique ID)
 *   SK  = METADATA
 *
 * GSI1 (for lookup by numeric userId):
 *   GSI1PK = USER#ID#<userId>
 *   GSI1SK = METADATA
 */
@DynamoDbBean
public class UserItem {

    // Primary key
    private String pk;
    private String sk;

    // GSI1 — lookup by userId
    private String gsi1Pk;
    private String gsi1Sk;

    // Attributes
    private Long userId;
    private String email;
    private String displayName;
    private String regNo;
    private Integer yearOfStudy;
    private String about;
    private String role;
    private boolean banned;
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

    @DynamoDbSecondaryPartitionKey(indexNames = "GSI1")
    @DynamoDbAttribute("GSI1PK")
    public String getGsi1Pk() { return gsi1Pk; }
    public void setGsi1Pk(String gsi1Pk) { this.gsi1Pk = gsi1Pk; }

    @DynamoDbSecondarySortKey(indexNames = "GSI1")
    @DynamoDbAttribute("GSI1SK")
    public String getGsi1Sk() { return gsi1Sk; }
    public void setGsi1Sk(String gsi1Sk) { this.gsi1Sk = gsi1Sk; }

    // ── Attribute accessors ───────────────────────────────────────────────────

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRegNo() { return regNo; }
    public void setRegNo(String regNo) { this.regNo = regNo; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isBanned() { return banned; }
    public void setBanned(boolean banned) { this.banned = banned; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    // ── Factory helpers ───────────────────────────────────────────────────────

    public static String buildPk(String email) {
        return "USER#" + email.toLowerCase();
    }

    public static String buildGsi1Pk(Long userId) {
        return "USER#ID#" + userId;
    }
}
