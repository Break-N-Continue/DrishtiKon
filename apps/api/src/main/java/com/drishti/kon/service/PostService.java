package com.drishti.kon.service;

import com.drishti.kon.dto.CreatePostRequest;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.entity.*;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.TagRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       TagRepository tagRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByIsVisibleTrueOrderByCreatedAtDesc()
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findByIdAndIsVisibleTrue(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return PostResponse.fromEntity(post);
    }

    @Transactional
    public PostResponse createPost(CreatePostRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (author.isBanned()) {
            throw new AccessDeniedException("Banned users cannot create posts");
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setAuthor(author);
        post.setExpiresAt(request.getExpiresAt());

        // Only moderators can assign tags
        if (request.getTagId() != null) {
            if (author.getRole() != Role.MODERATOR && author.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("Only moderators can assign tags to posts");
            }
            Tag tag = tagRepository.findById(request.getTagId())
                    .orElseThrow(() -> new RuntimeException("Tag not found with id: " + request.getTagId()));

            Post savedPost = postRepository.save(post);

            PostTag postTag = new PostTag(savedPost, tag);
            savedPost.getPostTags().add(postTag);

            return PostResponse.fromEntity(savedPost);
        }

        Post saved = postRepository.save(post);
        return PostResponse.fromEntity(saved);
    }

    @Transactional
    public void deletePost(Long id, User requester) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + id);
        }

        boolean isAuthor = post.getAuthor().getId().equals(requester.getId());
        boolean isModerator = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;

        if (!isAuthor && !isModerator) {
            throw new AccessDeniedException("You are not allowed to delete this post");
        }

        post.setVisible(false);
        postRepository.save(post);
    }

    @Transactional
    public PostResponse makePermanent(Long id, User requester) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));

        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + id);
        }

        boolean isAuthor = post.getAuthor().getId().equals(requester.getId());
        if (!isAuthor) {
            throw new AccessDeniedException("Only the post author can make a post permanent");
        }

        if (post.getExpiresAt() != null && post.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new RuntimeException("Cannot make an expired post permanent");
        }

        post.setExpiresAt(null);
        Post saved = postRepository.save(post);
        return PostResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return postRepository.findByAuthorIdAndIsVisibleTrueOrderByCreatedAtDesc(userId)
                .stream()
                .map(PostResponse::fromEntity)
                .toList();
    }

    @Transactional
    public PostResponse addTagToPost(Long postId, Long tagId, User requester) {
        boolean isModerator = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;
        if (!isModerator) {
            throw new AccessDeniedException("Only moderators can assign tags to posts");
        }

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));

        boolean alreadyTagged = post.getPostTags().stream()
                .anyMatch(pt -> pt.getTag().getId().equals(tagId));
        if (alreadyTagged) {
            throw new RuntimeException("Post already has this tag");
        }

        PostTag postTag = new PostTag(post, tag);
        post.getPostTags().add(postTag);
        Post saved = postRepository.save(post);
        return PostResponse.fromEntity(saved);
    }
}
