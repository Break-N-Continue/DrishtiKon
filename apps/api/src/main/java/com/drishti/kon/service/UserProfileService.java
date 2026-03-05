package com.drishti.kon.service;

import com.drishti.kon.dto.PagedResponse;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UserProfileCommentResponse;
// import com.drishti.kon.entity.Comment;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.PostUpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserProfileService {

    private final PostRepository postRepository;
    private final PostUpvoteRepository postUpvoteRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public UserProfileService(PostRepository postRepository,
                              PostUpvoteRepository postUpvoteRepository,
                              CommentRepository commentRepository,
                              UserRepository userRepository) {
        this.postRepository = postRepository;
        this.postUpvoteRepository = postUpvoteRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> getUserVisiblePosts(Long targetUserId, int page, int size, User requester) {
        validateAccess(targetUserId, requester);

        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> posts = postRepository
                .findByAuthorIdAndIsVisibleTrueOrderByCreatedAtDesc(targetUserId, pageable)
                .map(PostResponse::fromEntity);

        return PagedResponse.fromPage(posts);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PostResponse> getUserVisibleUpvotedPosts(Long targetUserId, int page, int size, User requester) {
        validateAccess(targetUserId, requester);

        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> posts = postUpvoteRepository
                .findVisibleUpvotedPostsByUserIdOrderByUpvotedAtDesc(targetUserId, pageable)
                .map(PostResponse::fromEntity);

        return PagedResponse.fromPage(posts);
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserProfileCommentResponse> getUserComments(Long targetUserId, int page, int size, User requester) {
        validateAccess(targetUserId, requester);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserProfileCommentResponse> comments = commentRepository
                .findByAuthorIdAndPostIsVisibleTrue(targetUserId, pageable)
                .map(UserProfileCommentResponse::fromEntity);

        return PagedResponse.fromPage(comments);
    }

    private void validateAccess(Long targetUserId, User requester) {
        if (!userRepository.existsById(targetUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + targetUserId);
        }

        boolean isOwner = requester.getId().equals(targetUserId);
        boolean isModerator = requester.getRole() == Role.MODERATOR;

        if (!isOwner && !isModerator) {
            throw new AccessDeniedException("You are not allowed to access this user's profile data");
        }
    }
}
