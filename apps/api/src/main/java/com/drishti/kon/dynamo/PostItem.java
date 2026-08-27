package com.drishti.kon.dynamo;

import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

import java.util.List;

/**
 * DynamoDB item representing a Post.
 *
 * Key design:
 *   PK  = POST#<postId>
 *   SK  = METADATA
 *
 * GSI1 — list all visible posts sorted by recency:
 *   GSI1PK = POSTS#ALL
 *   GSI1SK = <createdAt ISO-8601>   (lexicographic sort = chronological)
 *
 * Counts (upvoteCount, commentCount) are stored de-normalized here and updated
 * atomically via DynamoDB UpdateItem ADD expressions, eliminating the need for
 * separate COUNT queries.
 *
 * Tags are stored as a List<String> directly on the post, eliminating the
 * `tags` + `post_tags` join tables entirely.
 *
 * TTL: `expiresAtTtl` holds a Unix epoch second. DynamoDB native TTL will
 * auto-delete the item after that timestamp — replacing the @Scheduled Spring
 * cron job that previously set `is_visible = false`.
 */
@DynamoDbBean
public class PostItem {

    // Primary key
    private String pk;
    private String sk;

    // GSI1 — paginate all posts
    private String gsi1Pk;
    private String gsi1Sk;

    // GSI2PK = AUTHOR#<authorId> for author-scoped queries
    private String gsi2Pk;
    private String gsi2Sk;

    // Attributes
    private Long postId;
    private String authorId;         // numeric userId as string
    private String authorEmail;
    private String authorDisplayName;
    private String title;
    private String description;
    private String content;
    private String slug;
    private String coverImageUrl;
    private boolean draft;
    private boolean visible;
    private String createdAt;        // ISO-8601 string for GSI sort
    private String expiresAt;        // ISO-8601, informational
    private Long expiresAtTtl;       // Unix epoch seconds — DynamoDB TTL attribute
    private Long upvoteCount;
    private Long commentCount;
    private List<String> tags;

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

    @DynamoDbSecondaryPartitionKey(indexNames = "GSI2")
    @DynamoDbAttribute("GSI2PK")
    public String getGsi2Pk() { return gsi2Pk; }
    public void setGsi2Pk(String gsi2Pk) { this.gsi2Pk = gsi2Pk; }

    @DynamoDbSecondarySortKey(indexNames = "GSI2")
    @DynamoDbAttribute("GSI2SK")
    public String getGsi2Sk() { return gsi2Sk; }
    public void setGsi2Sk(String gsi2Sk) { this.gsi2Sk = gsi2Sk; }

    // ── Attribute accessors ───────────────────────────────────────────────────

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorEmail() { return authorEmail; }
    public void setAuthorEmail(String authorEmail) { this.authorEmail = authorEmail; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public boolean isDraft() { return draft; }
    public void setDraft(boolean draft) { this.draft = draft; }

    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getExpiresAt() { return expiresAt; }
    public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }

    public Long getExpiresAtTtl() { return expiresAtTtl; }
    public void setExpiresAtTtl(Long expiresAtTtl) { this.expiresAtTtl = expiresAtTtl; }

    public Long getUpvoteCount() { return upvoteCount; }
    public void setUpvoteCount(Long upvoteCount) { this.upvoteCount = upvoteCount; }

    public Long getCommentCount() { return commentCount; }
    public void setCommentCount(Long commentCount) { this.commentCount = commentCount; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    // ── Factory helpers ───────────────────────────────────────────────────────

    public static String buildPk(Long postId) {
        return "POST#" + postId;
    }

    public static final String SK_METADATA = "METADATA";
    public static final String GSI1PK_ALL  = "POSTS#ALL";
    public static String buildGsi2Pk(Long authorId) {
        return "AUTHOR#" + authorId;
    }
}
