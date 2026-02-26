package com.drishti.kon.controller;

import com.drishti.kon.entity.User;
import com.drishti.kon.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId,
                                              Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        commentService.deleteComment(commentId, requester);
        return ResponseEntity.noContent().build();
    }
}
