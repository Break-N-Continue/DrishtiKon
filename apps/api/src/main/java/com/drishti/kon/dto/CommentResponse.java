package com.drishti.kon.dto;

import com.drishti.kon.dynamo.CommentItem;
import java.time.OffsetDateTime;

public class CommentResponse {

    private String id;      // Now String (UUID) in DynamoDB, was Long in JPA
    private Long postId;
    private Long authorId;
    private String authorName;
    private String parentId;  // String UUID
    private String text;
    private OffsetDateTime createdAt;

    public CommentResponse() {}

    public static CommentResponse fromItem(CommentItem item) {
        CommentResponse r = new CommentResponse();
        r.setId(item.getCommentId());
        r.setPostId(item.getPostId());
        r.setAuthorId(item.getAuthorId() != null ? Long.parseLong(item.getAuthorId()) : null);
        r.setAuthorName(item.getAuthorDisplayName());
        r.setParentId(item.getParentCommentId());
        r.setText(item.getText());
        r.setCreatedAt(item.getCreatedAt() != null ? OffsetDateTime.parse(item.getCreatedAt()) : null);
        return r;
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getParentId() { return parentId; }
    public void setParentId(String parentId) { this.parentId = parentId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
