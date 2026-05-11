package com.drishti.kon.service;

import com.drishti.kon.dto.CreatePostRequest;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.entity.*;
import com.drishti.kon.repository.CommentRepository;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.TagRepository;
import com.drishti.kon.repository.UserRepository;
import com.drishti.kon.repository.UpvoteRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final UpvoteRepository upvoteRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       TagRepository tagRepository,
                       UpvoteRepository upvoteRepository,
                       CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.tagRepository = tagRepository;
        this.upvoteRepository = upvoteRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts(String sort) {
        List<Post> posts;
        if ("trending".equals(sort)) {
            posts = postRepository.findTop10ByUpvotes();
        } else {
            posts = postRepository.findAllByIsVisibleTrueAndIsDraftFalseOrderByCreatedAtDesc();
        }

        User currentUser = getCurrentUser();
        return posts.stream()
                .map(post -> buildResponse(post, currentUser))
                .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id) {
        Post post = postRepository.findByIdAndIsVisibleTrueAndIsDraftFalse(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        User currentUser = getCurrentUser();
        return buildResponse(post, currentUser);
    }

    @Transactional(readOnly = true)
    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlugAndIsVisibleTrueAndIsDraftFalse(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        User currentUser = getCurrentUser();
        return buildResponse(post, currentUser);
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
        post.setContent(resolveContent(request.getContent(), request.getDescription()));
        post.setAuthor(author);
        post.setExpiresAt(request.getExpiresAt());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setDraft(Boolean.TRUE.equals(request.getIsDraft()));
        post.setSlug(ensureUniqueSlug(resolveSlugSource(request.getSlug(), request.getTitle())));

        Post saved = postRepository.save(post);

        List<String> normalizedTags = normalizeTags(request.getTags());
        if (!normalizedTags.isEmpty()) {
            applyTags(saved, normalizedTags);
            saved = postRepository.save(saved);
        } else if (request.getTagId() != null) {
            if (author.getRole() != Role.MODERATOR && author.getRole() != Role.ADMIN) {
                throw new AccessDeniedException("Only moderators can assign tags to posts");
            }
            Tag tag = tagRepository.findById(request.getTagId())
                    .orElseThrow(() -> new RuntimeException("Tag not found with id: " + request.getTagId()));

            PostTag postTag = new PostTag(saved, tag);
            saved.getPostTags().add(postTag);
            saved = postRepository.save(saved);
        }

        return buildResponse(saved, author);
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

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        return (User) authentication.getPrincipal();
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
        return buildResponse(saved, requester);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return postRepository.findByAuthorIdAndIsVisibleTrueAndIsDraftFalseOrderByCreatedAtDesc(userId)
                .stream()
            .map(post -> buildResponse(post, null))
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
        return buildResponse(saved, requester);
    }

    private PostResponse buildResponse(Post post, User currentUser) {
        long upvoteCount = upvoteRepository.countByPostId(post.getId());
        long commentCount = commentRepository.countByPostId(post.getId());
        boolean hasUpvoted = currentUser != null
                && upvoteRepository.existsByPostIdAndUserId(post.getId(), currentUser.getId());
        return PostResponse.fromEntity(post, upvoteCount, commentCount, hasUpvoted);
    }

    private String resolveContent(String content, String description) {
        if (content == null || content.isBlank()) {
            return description;
        }
        return content;
    }

    private String resolveSlugSource(String slug, String title) {
        if (slug != null && !slug.isBlank()) {
            return slug;
        }
        return title;
    }

    private String ensureUniqueSlug(String source) {
        String baseSlug = slugify(source);
        if (!postRepository.existsBySlug(baseSlug)) {
            return baseSlug;
        }
        int suffix = 2;
        String candidate = baseSlug;
        while (postRepository.existsBySlug(candidate)) {
            candidate = baseSlug + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private String slugify(String value) {
        if (value == null) {
            return "post";
        }
        String slug = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (slug.isBlank()) {
            return "post";
        }
        return slug.length() > 240 ? slug.substring(0, 240) : slug;
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) {
            return List.of();
        }
        return tags.stream()
                .filter(tag -> tag != null && !tag.isBlank())
                .map(tag -> tag.trim())
                .distinct()
                .toList();
    }

    private void applyTags(Post post, List<String> tags) {
        for (String tagName : tags) {
            Tag tag = tagRepository.findByNameIgnoreCase(tagName)
                    .orElseGet(() -> tagRepository.save(createTag(tagName)));
            boolean alreadyTagged = post.getPostTags().stream()
                    .anyMatch(pt -> pt.getTag().getId().equals(tag.getId()));
            if (!alreadyTagged) {
                post.getPostTags().add(new PostTag(post, tag));
            }
        }
    }

    private Tag createTag(String tagName) {
        Tag tag = new Tag();
        tag.setName(tagName);
        return tag;
    }
}
