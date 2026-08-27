package com.drishti.kon.controller;

import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UpdateAboutMeRequest;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * User profile endpoints.
 *
 * Note: JPA-based Pageable has been removed. All profile queries now return
 * full lists. DynamoDB pagination (via LastEvaluatedKey) can be added if the
 * dataset grows large.
 */
@RestController
@RequestMapping("/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PatchMapping("/me/about")
    public ResponseEntity<Map<String, String>> updateAboutMe(
            @Valid @RequestBody UpdateAboutMeRequest request,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        userProfileService.updateAboutMe(currentUser.getId(), request.getAboutMe());
        return ResponseEntity.ok(Map.of("message", "About me updated successfully"));
    }

    @GetMapping("/{userid}/posts")
    public ResponseEntity<List<PostResponse>> getPostsByUser(
            @PathVariable Long userid,
            Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getVisiblePostsByUser(userid, requester));
    }

    @GetMapping("/{userid}/upvoted")
    public ResponseEntity<List<PostResponse>> getUpvotedPostsByUser(
            @PathVariable Long userid,
            Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getVisibleUpvotedPostsByUser(userid, requester));
    }

    @GetMapping("/{userid}/comments")
    public ResponseEntity<List<UserProfileCommentResponse>> getCommentsByUser(
            @PathVariable Long userid,
            Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        return ResponseEntity.ok(userProfileService.getVisibleCommentsByUser(userid, requester));
    }
}
