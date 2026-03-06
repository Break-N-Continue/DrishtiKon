package com.drishti.kon.controller;

import com.drishti.kon.dto.ToggleUpvoteResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.UpvoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/upvotes")
public class UpvoteController {

    private final UpvoteService upvoteService;

    public UpvoteController(UpvoteService upvoteService) {
        this.upvoteService = upvoteService;
    }

    @PostMapping("/posts/{postId}/toggle")
    public ResponseEntity<ToggleUpvoteResponse> togglePostUpvote(@PathVariable Long postId,
                                                                 Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        ToggleUpvoteResponse response = upvoteService.togglePostUpvote(postId, requester.getId());
        return ResponseEntity.ok(response);
    }
}
