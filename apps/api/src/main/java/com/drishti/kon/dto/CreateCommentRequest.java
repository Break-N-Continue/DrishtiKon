package com.drishti.kon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(message = "Text is required")
    @Size(max = 500, message = "Text must be at most 500 characters")
    private String text;

    private Long parentId;

    public CreateCommentRequest() {}

    public CreateCommentRequest(String text, Long parentId) {
        setText(text);
        this.parentId = parentId;
    }

    public String getText() { return text; }

    public void setText(String text) {
        this.text = text == null ? null : text.trim();
    }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId;}
}
