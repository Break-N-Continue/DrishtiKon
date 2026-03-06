package com.drishti.kon.controller;

import com.drishti.kon.dto.PageResponseDto;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.User;
import com.drishti.kon.service.UserProfileService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/users")
public class UserProfileController {

    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<PageResponseDto<PostResponse>> getPostsByUser(@PathVariable Long id,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "20") int size,
                                                                        Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisiblePostsByUser(id, requester, pageable)
        ));
    }

    @GetMapping("/{id}/upvoted")
    public ResponseEntity<PageResponseDto<PostResponse>> getUpvotedPostsByUser(@PathVariable Long id,
                                                                               @RequestParam(defaultValue = "0") int page,
                                                                               @RequestParam(defaultValue = "20") int size,
                                                                               Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisibleUpvotedPostsByUser(id, requester, pageable)
        ));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<PageResponseDto<UserProfileCommentResponse>> getCommentsByUser(@PathVariable Long id,
                                                                                          @RequestParam(defaultValue = "0") int page,
                                                                                          @RequestParam(defaultValue = "20") int size,
                                                                                          Authentication authentication) {
        User requester = (User) authentication.getPrincipal();
        Pageable pageable = buildPageable(page, size);
        return ResponseEntity.ok(PageResponseDto.fromPage(
                userProfileService.getVisibleCommentsByUser(id, requester, pageable)
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
