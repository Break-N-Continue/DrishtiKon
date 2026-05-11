package com.drishti.kon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 255, message = "Title must be between 5 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;

    private List<String> tags;

    private String coverImageUrl;

    private Boolean isDraft;

    private String slug;

    private OffsetDateTime expiresAt;

    private Long tagId;

    public CreatePostRequest() {}

    public CreatePostRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Boolean getIsDraft() { return isDraft; }
    public void setIsDraft(Boolean isDraft) { this.isDraft = isDraft; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }

    public Long getTagId() { return tagId; }
    public void setTagId(Long tagId) { this.tagId = tagId; }
}
