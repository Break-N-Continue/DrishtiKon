package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * DynamoDB item representing an Upvote record.
 *
 * Key design:
 *   PK  = POST#<postId>
 *   SK  = UPVOTE#<userId>
 *
 * The PK+SK uniqueness naturally enforces one upvote per user per post
 * (replaces the SQL UNIQUE constraint on upvotes(post_id, user_id)).
 *
 * GSI1 — list posts upvoted by a specific user:
 *   GSI1PK = USER#<userId>
 *   GSI1SK = UPVOTE#<createdAt>
 */
@DynamoDbBean
public class UpvoteItem {

    private String pk;
    private String sk;
    private String gsi1Pk;
    private String gsi1Sk;

    private Long postId;
    private Long userId;
    private String createdAt;

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

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static String buildPk(Long postId) { return "POST#" + postId; }
    public static String buildSk(Long userId)  { return "UPVOTE#" + userId; }
    public static String buildGsi1Pk(Long userId) { return "USER#" + userId; }
    public static String buildGsi1Sk(String createdAt) { return "UPVOTE#" + createdAt; }
}
