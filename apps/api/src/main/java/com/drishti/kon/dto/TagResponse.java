package com.drishti.kon.dto;

import com.drishti.kon.entity.Tag;

public class TagResponse {

    private Long id;
    private String name;

    public TagResponse() {}

    public TagResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static TagResponse fromEntity(Tag tag) {
        return new TagResponse(tag.getId(), tag.getName());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
