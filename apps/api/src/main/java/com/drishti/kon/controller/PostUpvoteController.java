package com.drishti.kon.controller;

import com.drishti.kon.entity.PostUpvote;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.PostUpvoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/postsUpVote")
public class PostUpvoteController {

    private final PostUpvoteService postUpvoteService;

    public PostUpvoteController(PostUpvoteService postUpvoteService) {
        this.postUpvoteService = postUpvoteService;
    }

    @PostMapping("/{postId}/upvote")
    public ResponseEntity<?> toggleUpVote(@PathVariable Long postId, @AuthenticationPrincipal User user) {

        boolean isNowUpVoted = postUpvoteService.toggleUpvote(postId, user);
        return ResponseEntity.ok(Map.of("upvote", isNowUpVoted));

    }

    @GetMapping("/{postId}/upvotes/count")
    public ResponseEntity<?> getUpvoteCount(@PathVariable Long postId,  @AuthenticationPrincipal User user) {

        long count = postUpvoteService.getUpvoteCount(postId);

        return ResponseEntity.ok(
                Map.of("count", count)
        );
    }


}
