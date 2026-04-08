package com.drishti.kon.controller;

import com.drishti.kon.dto.PageResponseDto;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UpdateAboutMeRequest;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.UserProfileService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PatchMapping("/me/about")
    public ResponseEntity<Map<String, String>> updateAboutMe(@Valid @RequestBody UpdateAboutMeRequest request,
                                                             Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        userProfileService.updateAboutMe(currentUser.getId(), request.getAboutMe());
        return ResponseEntity.ok(Map.of("message", "About me updated successfully"));
    }

    @GetMapping("/{userid}/posts")
    public ResponseEntity<PageResponseDto<PostResponse>> getPostsByUser(@PathVariable Long userid,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "20") int size,
                                                                        Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisiblePostsByUser(userid, requester, pageable)
        ));
    }

    @GetMapping("/{userid}/upvoted")
    public ResponseEntity<PageResponseDto<PostResponse>> getUpvotedPostsByUser(@PathVariable Long userid,
                                                                               @RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "20") int size,
                                                                               Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisibleUpvotedPostsByUser(userid, requester, pageable)
        ));
    }

    @GetMapping("/{userid}/comments")
    public ResponseEntity<PageResponseDto<UserProfileCommentResponse>> getCommentsByUser(@PathVariable Long userid,
                                                                                          @RequestParam(defaultValue = "0") int page,
                                                                                          @RequestParam(defaultValue = "20") int size,
                                                                                          Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisibleCommentsByUser(userid, requester, pageable)
        ));
    }

    private Pageable buildPageable(int page, int size) {
        int resolvedSize = size == 0 ? DEFAULT_SIZE : size;
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page must be >= 0");
        }
        if (resolvedSize < 1 || resolvedSize > MAX_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "size must be between 1 and " + MAX_SIZE);
        }
        return PageRequest.of(page, resolvedSize);
    }
}
