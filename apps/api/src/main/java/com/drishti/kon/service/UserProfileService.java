package com.drishti.kon.service;

import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.dynamo.CommentItem;
import com.drishti.kon.dynamo.PostItem;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

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

    public void updateAboutMe(Long userId, String aboutMe) {
        var userItem = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userItem.setAbout(aboutMe);
        userRepository.save(userItem);
    }

    public List<PostResponse> getVisiblePostsByUser(Long targetUserId, User requester) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        return postRepository.findByAuthorIdVisiblePublishedOrderByCreatedAtDesc(targetUserId)
                .stream()
                .map(PostResponse::fromItem)
                .toList();
    }

    public List<PostResponse> getVisibleUpvotedPostsByUser(Long targetUserId, User requester) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        List<Long> upvotedPostIds = upvoteRepository.findUpvotedPostIdsByUserIdOrderByCreatedAtDesc(targetUserId);
        return upvotedPostIds.stream()
                .map(postRepository::findById)
                .filter(opt -> opt.isPresent() && opt.get().isVisible() && !opt.get().isDraft())
                .map(opt -> PostResponse.fromItem(opt.get()))
                .toList();
    }

    public List<UserProfileCommentResponse> getVisibleCommentsByUser(Long targetUserId, User requester) {
        assertAccess(targetUserId, requester);
        assertTargetUserExists(targetUserId);
        return commentRepository.findByAuthorIdOrderByCreatedAtDesc(targetUserId)
                .stream()
                .map(c -> {
                    PostItem post = postRepository.findById(c.getPostId()).orElse(null);
                    if (post == null || !post.isVisible()) return null;
                    return new UserProfileCommentResponse(
                            c.getCommentId(),
                            c.getText(),
                            c.getCreatedAt() != null ? OffsetDateTime.parse(c.getCreatedAt()) : null,
                            post.getPostId(),
                            post.getTitle()
                    );
                })
                .filter(r -> r != null)
                .toList();
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
