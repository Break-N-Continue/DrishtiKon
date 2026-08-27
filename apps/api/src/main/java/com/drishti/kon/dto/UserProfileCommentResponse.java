package com.drishti.kon.dto;

import java.time.OffsetDateTime;

/**
 * Comment summary projected for user profile pages.
 * Note: commentId is now a String (UUID) in the DynamoDB model.
 */
public class UserProfileCommentResponse {

    private String id;       // UUID string in DynamoDB model
    private String text;
    private OffsetDateTime createdAt;
    private Long postId;
    private String postTitle;

    public UserProfileCommentResponse(String id,
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

    public String getId() { return id; }
    public String getText() { return text; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public Long getPostId() { return postId; }
    public String getPostTitle() { return postTitle; }
}
