package com.drishti.kon.controller;

import com.drishti.kon.dto.PagedResponse;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.UserProfileService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users/profile")
@Validated
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{userid}/posts")
    public ResponseEntity<PagedResponse<PostResponse>> getUserPosts(@PathVariable Long userid,
                                                                    @RequestParam(defaultValue = "0") @Min(0) int page,
                                                                    @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
                                                                    Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getUserVisiblePosts(userid, page, size, requester));
    }

    @GetMapping("/{userid}/upvoted")
    public ResponseEntity<PagedResponse<PostResponse>> getUserUpvotedPosts(@PathVariable Long userid,
                                                                            @RequestParam(defaultValue = "0") @Min(0) int page,
                                                                            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
                                                                            Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getUserVisibleUpvotedPosts(userid, page, size, requester));
    }

    @GetMapping("/{userid}/comments")
    public ResponseEntity<PagedResponse<UserProfileCommentResponse>> getUserComments(@PathVariable Long userid,
                                                                                      @RequestParam(defaultValue = "0") @Min(0) int page,
                                                                                      @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
                                                                                      Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getUserComments(userid, page, size, requester));
    }
}
