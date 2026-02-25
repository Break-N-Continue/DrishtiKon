package com.drishti.kon.controller;

import com.drishti.kon.dto.CommentResponse;
import com.drishti.kon.dto.CreateCommentRequest;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/{id}")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long id,
                                                         @Valid @RequestBody CreateCommentRequest request,
                                                         Authentication authentication) {
        User author = (User) authentication.getPrincipal();
        CommentResponse created = commentService.createComment(id, request, author.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id, Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        commentService.deleteComment(id, requester);
        return ResponseEntity.noContent().build();
    }
}
