package com.drishti.kon.service;

import com.drishti.kon.dto.CommentResponse;
import com.drishti.kon.dto.CreateCommentRequest;
import com.drishti.kon.dynamo.CommentItem;
import com.drishti.kon.dynamo.PostItem;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse createComment(Long postId, CreateCommentRequest request, Long authorId) {
        PostItem post = getVisiblePostOrThrow(postId);

        User author = userRepository.findById(authorId)
                .map(User::fromItem)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (author.isBanned()) {
            throw new AccessDeniedException("Banned users cannot post comments");
        }

        String parentCommentId = null;
        if (request.getParentId() != null) {
            // parentId in DynamoDB is now a String (UUID-based commentId)
            String parentIdStr = String.valueOf(request.getParentId());
            commentRepository.findByCommentIdAndPostId(parentIdStr, postId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found: " + parentIdStr));
            parentCommentId = parentIdStr;
        }

        String now = OffsetDateTime.now().toString();
        String commentId = UUID.randomUUID().toString();

        CommentItem comment = new CommentItem();
        comment.setCommentId(commentId);
        comment.setPostId(postId);
        comment.setAuthorId(String.valueOf(authorId));
        comment.setAuthorDisplayName(author.getDisplayName());
        comment.setParentCommentId(parentCommentId);
        comment.setText(request.getText());
        comment.setCreatedAt(now);
        comment.setPk("POST#" + postId);
        comment.setSk(CommentItem.buildSk(now, commentId));
        comment.setGsi1Pk(CommentItem.buildGsi1Pk(authorId));
        comment.setGsi1Sk("COMMENT#" + now);

        CommentItem saved = commentRepository.save(comment);

        // Increment denormalized commentCount on the post
        postRepository.updateCommentCount(postId, +1L);

        return CommentResponse.fromItem(saved);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        getVisiblePostOrThrow(postId);
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentResponse::fromItem)
                .toList();
    }

    public void deleteComment(String commentId, User requester) {
        CommentItem comment = commentRepository.findByCommentId(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found: " + commentId));

        boolean isAuthor = String.valueOf(requester.getId()).equals(comment.getAuthorId());
        boolean isModerator = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;
        if (!isAuthor && !isModerator) {
            throw new AccessDeniedException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
        postRepository.updateCommentCount(comment.getPostId(), -1L);
    }

    private PostItem getVisiblePostOrThrow(Long postId) {
        PostItem post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }
        return post;
    }
}
