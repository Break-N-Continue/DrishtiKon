package com.drishti.kon.dto;

/**
 * Tag response DTO.
 * In DynamoDB, tags are plain strings — there is no numeric ID.
 * The id field is kept for API compatibility but will be null.
 */
public class TagResponse {

    private Long id;    // null in DynamoDB model (no separate Tag entity)
    private String name;

    public TagResponse() {}

    public TagResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
