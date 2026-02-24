package com.drishti.kon.dto;

import com.drishti.kon.entity.Post;
import java.time.OffsetDateTime;

public class PostResponse {

    private Long id;
    private String title;
    private String description;
    private String authorName;
    private Long authorId;
    private OffsetDateTime createdAt;

    public PostResponse() {}

    public static PostResponse fromEntity(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setDescription(post.getDescription());
        response.setAuthorId(post.getAuthor().getId());
        response.setAuthorName(post.getAuthor().getDisplayName());
        response.setCreatedAt(post.getCreatedAt());
        return response;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
