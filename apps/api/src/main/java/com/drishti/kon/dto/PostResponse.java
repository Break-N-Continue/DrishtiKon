package com.drishti.kon.dto;

import com.drishti.kon.entity.Post;
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

    public static PostResponse fromEntity(Post post, long upvoteCount, long commentCount, boolean hasUpvoted) {
        PostResponse response = fromEntity(post);
        response.setUpvoteCount(upvoteCount);
        response.setCommentCount(commentCount);
        response.setHasUpvoted(hasUpvoted);
        return response;
    }

    public static PostResponse fromEntity(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setDescription(post.getDescription());
        response.setContent(post.getContent());
        response.setSlug(post.getSlug());
        response.setCoverImageUrl(post.getCoverImageUrl());
        response.setAuthorId(post.getAuthor().getId());
        response.setAuthorName(post.getAuthor().getDisplayName());
        response.setVisible(post.isVisible());
        response.setDraft(post.isDraft());
        response.setExpiresAt(post.getExpiresAt());
        response.setCreatedAt(post.getCreatedAt());
        response.setTags(
                post.getPostTags().stream()
                        .map(pt -> pt.getTag().getName())
                        .toList()
        );
        return response;
    }

    // Getters and Setters
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
