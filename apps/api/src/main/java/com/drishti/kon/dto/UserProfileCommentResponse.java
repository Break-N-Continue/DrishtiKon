package com.drishti.kon.dto;

import com.drishti.kon.entity.Comment;

import java.time.OffsetDateTime;

public class UserProfileCommentResponse {

    private Long id;
    private Long postId;
    private String postTitle;
    private Long authorId;
    private String authorName;
    private Long parentId;
    private String text;
    private OffsetDateTime createdAt;

    public UserProfileCommentResponse() {
    }

    public static UserProfileCommentResponse fromEntity(Comment comment) {
        UserProfileCommentResponse response = new UserProfileCommentResponse();
        response.setId(comment.getId());
        response.setPostId(comment.getPost().getId());
        response.setPostTitle(comment.getPost().getTitle());
        response.setAuthorId(comment.getAuthor().getId());
        response.setAuthorName(comment.getAuthor().getDisplayName());
        response.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        response.setText(comment.getText());
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public String getPostTitle() {
        return postTitle;
    }

    public void setPostTitle(String postTitle) {
        this.postTitle = postTitle;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
