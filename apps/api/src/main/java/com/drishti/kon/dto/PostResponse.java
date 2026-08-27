package com.drishti.kon.dto;

import com.drishti.kon.dynamo.PostItem;
import java.time.OffsetDateTime;
import java.util.List;

public class PostResponse {

    private Long id;
    private String title;
    private String description;
    private String content;
    private String slug;
    private String coverImageUrl;
    private String authorName;
    private Long authorId;
    private boolean isVisible;
    private boolean isDraft;
    private OffsetDateTime expiresAt;
    private List<String> tags;
    private OffsetDateTime createdAt;
    private long upvoteCount;
    private long commentCount;
    private boolean hasUpvoted;

    public PostResponse() {}

    public static PostResponse fromItem(PostItem item, boolean hasUpvoted) {
        PostResponse r = new PostResponse();
        r.setId(item.getPostId());
        r.setTitle(item.getTitle());
        r.setDescription(item.getDescription());
        r.setContent(item.getContent());
        r.setSlug(item.getSlug());
        r.setCoverImageUrl(item.getCoverImageUrl());
        r.setAuthorId(item.getAuthorId() != null ? Long.parseLong(item.getAuthorId()) : null);
        r.setAuthorName(item.getAuthorDisplayName());
        r.setVisible(item.isVisible());
        r.setDraft(item.isDraft());
        r.setExpiresAt(item.getExpiresAt() != null ? OffsetDateTime.parse(item.getExpiresAt()) : null);
        r.setCreatedAt(item.getCreatedAt() != null ? OffsetDateTime.parse(item.getCreatedAt()) : null);
        r.setTags(item.getTags() != null ? item.getTags() : List.of());
        r.setUpvoteCount(item.getUpvoteCount() != null ? item.getUpvoteCount() : 0L);
        r.setCommentCount(item.getCommentCount() != null ? item.getCommentCount() : 0L);
        r.setHasUpvoted(hasUpvoted);
        return r;
    }

    /** Convenience overload — hasUpvoted defaults to false (used when no auth context). */
    public static PostResponse fromItem(PostItem item) {
        return fromItem(item, false);
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public boolean isVisible() { return isVisible; }
    public void setVisible(boolean visible) { isVisible = visible; }

    public boolean isDraft() { return isDraft; }
    public void setDraft(boolean draft) { isDraft = draft; }

    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public long getUpvoteCount() { return upvoteCount; }
    public void setUpvoteCount(long upvoteCount) { this.upvoteCount = upvoteCount; }

    public long getCommentCount() { return commentCount; }
    public void setCommentCount(long commentCount) { this.commentCount = commentCount; }

    public boolean isHasUpvoted() { return hasUpvoted; }
    public void setHasUpvoted(boolean hasUpvoted) { this.hasUpvoted = hasUpvoted; }
}
