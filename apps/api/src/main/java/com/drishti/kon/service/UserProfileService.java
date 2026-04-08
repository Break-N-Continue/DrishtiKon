package com.drishti.kon.service;

import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final PostRepository postRepository;
    private final UpvoteRepository upvoteRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public UserProfileService(PostRepository postRepository,
                              UpvoteRepository upvoteRepository,
                              CommentRepository commentRepository,
                              UserRepository userRepository) {
        this.postRepository = postRepository;
        this.upvoteRepository = upvoteRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateAboutMe(Long userId, String aboutMe) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setAboutMe(aboutMe);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getVisiblePostsByUser(Long targetUserId, User requester, Pageable pageable) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        return postRepository.findByAuthorIdAndIsVisibleTrueOrderByCreatedAtDesc(targetUserId, pageable)
                .map(PostResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getVisibleUpvotedPostsByUser(Long targetUserId, User requester, Pageable pageable) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        return upvoteRepository.findVisibleUpvotedPostsByUserIdOrderByUpvoteCreatedAtDesc(targetUserId, pageable)
                .map(PostResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<UserProfileCommentResponse> getVisibleCommentsByUser(Long targetUserId, User requester, Pageable pageable) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        return commentRepository.findUserVisibleCommentsWithPostInfo(targetUserId, pageable);
    }

    private void assertTargetUserExists(Long targetUserId) {
        if (!userRepository.existsById(targetUserId)) {
            throw new RuntimeException("User not found with id: " + targetUserId);
        }
    }

    private void assertAccess(Long targetUserId, User requester) {
        boolean isSelf = requester.getId().equals(targetUserId);
        boolean isModeratorOrAdmin = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;
        if (!isSelf && !isModeratorOrAdmin) {
            throw new AccessDeniedException("You are not allowed to access this user's profile data");
        }
    }
}
