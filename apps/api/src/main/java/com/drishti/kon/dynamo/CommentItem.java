package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

/**
 * DynamoDB item representing a Comment.
 *
 * Key design (co-located with its Post for efficient single-query fetch):
 *   PK  = POST#<postId>
 *   SK  = COMMENT#<createdAtISO>#<commentId>   (lexicographic sort = chronological)
 *
 * GSI1 — list comments by a specific author:
 *   GSI1PK = USER#<authorId>
 *   GSI1SK = COMMENT#<createdAt>
 *
 * parent comment references are stored as parentId (commentId string or null).
 */
@DynamoDbBean
public class CommentItem {

    // Primary key
    private String pk;
    private String sk;

    // GSI1 — author's comment history
    private String gsi1Pk;
    private String gsi1Sk;

    // Attributes
    private String commentId;
    private Long postId;
    private String authorId;
    private String authorDisplayName;
    private String parentCommentId;   // null if top-level
    private String text;
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

    public String getCommentId() { return commentId; }
    public void setCommentId(String commentId) { this.commentId = commentId; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public String getParentCommentId() { return parentCommentId; }
    public void setParentCommentId(String parentCommentId) { this.parentCommentId = parentCommentId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    // ── Factory helpers ───────────────────────────────────────────────────────

    /** Sort key: COMMENT#<createdAtISO>#<commentId> — chronological via lexicographic order */
    public static String buildSk(String createdAt, String commentId) {
        return "COMMENT#" + createdAt + "#" + commentId;
    }

    public static String buildGsi1Pk(Long authorId) {
        return "USER#" + authorId;
    }
}
