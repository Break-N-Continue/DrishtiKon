package com.drishti.kon.controller;

import com.drishti.kon.dto.CommentResponse;
import com.drishti.kon.dto.CreateCommentRequest;
import com.drishti.kon.dto.CreatePostRequest;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.security.CurrentUser;
import com.drishti.kon.service.CommentService;
import com.drishti.kon.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
                                                   @CurrentUser User author) {
        PostResponse created = postService.createPost(request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePost(@PathVariable Long id,
                                                         @CurrentUser User requester) {
        postService.deletePost(id, requester);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @PatchMapping("/{id}/make-permanent")
    public ResponseEntity<PostResponse> makePermanent(@PathVariable Long id,
                                                      @CurrentUser User requester) {
        PostResponse updated = postService.makePermanent(id, requester);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/tags/{tagId}")
    public ResponseEntity<PostResponse> addTagToPost(@PathVariable Long id,
                                                     @PathVariable Long tagId,
                                                     @CurrentUser User requester) {
        PostResponse updated = postService.addTagToPost(id, tagId, requester);
        return ResponseEntity.ok(updated);
    }

    // ── Comment sub-resource endpoints ──────────────────────────────────────

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId,
                                                        @Valid @RequestBody CreateCommentRequest request,
                                                        @CurrentUser User author) {
        CommentResponse created = commentService.createComment(postId, request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }
}
