package com.drishti.kon.controller;

import com.drishti.kon.dto.TagRequest;
import com.drishti.kon.dto.TagResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.security.CurrentUser;
import com.drishti.kon.service.TagService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tags")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @PostMapping
    public ResponseEntity<TagResponse> createTag(@Valid @RequestBody TagRequest request,
                                                  @CurrentUser User requester) {
        TagResponse created = tagService.createTag(request, requester);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTag(@PathVariable Long id,
                                                         @CurrentUser User requester) {
        tagService.deleteTag(id, requester);
        return ResponseEntity.ok(Map.of("message", "Tag deleted successfully"));
    }
}
