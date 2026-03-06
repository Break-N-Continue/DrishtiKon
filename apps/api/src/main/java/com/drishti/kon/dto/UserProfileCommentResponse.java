package com.drishti.kon.dto;

import java.time.OffsetDateTime;

public class UserProfileCommentResponse {

    private Long id;
    private String text;
    private OffsetDateTime createdAt;
    private Long postId;
    private String postTitle;

    public UserProfileCommentResponse(Long id,
                                      String text,
                                      OffsetDateTime createdAt,
                                      Long postId,
                                      String postTitle) {
        this.id = id;
        this.text = text;
        this.createdAt = createdAt;
        this.postId = postId;
        this.postTitle = postTitle;
    }

    public Long getId() { return id; }
    public String getText() { return text; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public Long getPostId() { return postId; }
    public String getPostTitle() { return postTitle; }
}
