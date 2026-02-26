package com.drishti.kon.service;

import com.drishti.kon.dto.CommentResponse;
import com.drishti.kon.dto.CreateCommentRequest;
import com.drishti.kon.entity.Comment;
import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Transactional
    public CommentResponse createComment(Long postId, CreateCommentRequest request, Long authorId) {
        Post post = getVisiblePostOrThrow(postId);

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (author.isBanned()) {
            throw new AccessDeniedException("Banned users cannot post comments");
        }

        Comment parent = null;
        if (request.getParentId() != null) {
            parent = commentRepository.findByIdAndPostId(request.getParentId(), postId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found with id: " + request.getParentId()));
        }

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setParent(parent);
        comment.setText(request.getText());

        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.fromEntity(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        getVisiblePostOrThrow(postId);
        return commentRepository.findByPostIdWithAuthorAndParent(postId)
                .stream()
                .map(CommentResponse::fromEntity)
                .toList();
    }

    @Transactional
    public void deleteComment(Long commentId, User requester) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        boolean isAuthor = comment.getAuthor().getId().equals(requester.getId());
        boolean isModerator = requester.getRole() == Role.MODERATOR;
        if (!isAuthor && !isModerator) {
            throw new AccessDeniedException("You are not allowed to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private Post getVisiblePostOrThrow(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }
        return post;
    }
}
