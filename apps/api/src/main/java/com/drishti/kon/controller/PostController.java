package com.drishti.kon.controller;

import com.drishti.kon.dto.CommentResponse;
import com.drishti.kon.dto.CreateCommentRequest;
import com.drishti.kon.dto.CreatePostRequest;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.CommentService;
import com.drishti.kon.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request,
                                                   Authentication authentication) {
        User author = (User) authentication.getPrincipal();
        PostResponse created = postService.createPost(request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id,
                                                         Authentication authentication) {
        postService.deletePost(id);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    // ── Comment sub-resource endpoints ──────────────────────────────────────

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId,
                                                        @Valid @RequestBody CreateCommentRequest request,
                                                        Authentication authentication) {
        User author = (User) authentication.getPrincipal();
        CommentResponse created = commentService.createComment(postId, request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}
