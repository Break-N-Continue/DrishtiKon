package com.drishti.kon.service;

import com.drishti.kon.dto.CreatePostRequest;
import com.drishti.kon.dto.PostResponse;
import com.drishti.kon.dynamo.PostItem;
import com.drishti.kon.dynamo.UserItem;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final UpvoteRepository upvoteRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       UpvoteRepository upvoteRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.upvoteRepository = upvoteRepository;
    }

    public List<PostResponse> getAllPosts(String sort) {
        List<PostItem> posts;
        if ("trending".equals(sort)) {
            posts = postRepository.findTop10ByUpvotes();
        } else {
            posts = postRepository.findAllVisiblePublishedOrderByCreatedAtDesc();
        }
        User currentUser = getCurrentUser();
        return posts.stream().map(p -> buildResponse(p, currentUser)).toList();
    }

    public PostResponse getPostById(Long id) {
        PostItem post = postRepository.findByIdVisibleAndPublished(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        return buildResponse(post, getCurrentUser());
    }

    public PostResponse getPostBySlug(String slug) {
        PostItem post = postRepository.findBySlugVisibleAndPublished(slug)
                .orElseThrow(() -> new RuntimeException("Post not found with slug: " + slug));
        return buildResponse(post, getCurrentUser());
    }

    public PostResponse createPost(CreatePostRequest request, Long authorId) {
        UserItem authorItem = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User author = User.fromItem(authorItem);

        if (author.isBanned()) {
            throw new AccessDeniedException("Banned users cannot create posts");
        }

        String now = OffsetDateTime.now().toString();
        PostItem post = new PostItem();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setContent(resolveContent(request.getContent(), request.getDescription()));
        post.setAuthorId(String.valueOf(authorId));
        post.setAuthorEmail(author.getEmail());
        post.setAuthorDisplayName(author.getDisplayName());
        post.setDraft(Boolean.TRUE.equals(request.getIsDraft()));
        post.setVisible(true);
        post.setUpvoteCount(0L);
        post.setCommentCount(0L);
        post.setCreatedAt(now);
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setTags(normalizeTags(request.getTags()));

        if (request.getExpiresAt() != null) {
            post.setExpiresAt(request.getExpiresAt().toString());
            post.setExpiresAtTtl(request.getExpiresAt().toEpochSecond()); // DynamoDB TTL
        }

        String slug = ensureUniqueSlug(resolveSlugSource(request.getSlug(), request.getTitle()));
        post.setSlug(slug);

        PostItem saved = postRepository.save(post);
        return buildResponse(saved, author);
    }

    public void deletePost(Long id, User requester) {
        PostItem post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + id);
        }

        boolean isAuthor = String.valueOf(requester.getId()).equals(post.getAuthorId());
        boolean isModerator = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;

        if (!isAuthor && !isModerator) {
            throw new AccessDeniedException("You are not allowed to delete this post");
        }

        post.setVisible(false);
        postRepository.save(post);
    }

    public PostResponse makePermanent(Long id, User requester) {
        PostItem post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + id);
        }

        boolean isAuthor = String.valueOf(requester.getId()).equals(post.getAuthorId());
        if (!isAuthor) {
            throw new AccessDeniedException("Only the post author can make a post permanent");
        }

        if (post.getExpiresAt() != null) {
            OffsetDateTime expiresAt = OffsetDateTime.parse(post.getExpiresAt());
            if (expiresAt.isBefore(OffsetDateTime.now())) {
                throw new RuntimeException("Cannot make an expired post permanent");
            }
        }

        post.setExpiresAt(null);
        post.setExpiresAtTtl(null); // Remove TTL so DynamoDB won't delete it
        PostItem saved = postRepository.save(post);
        return buildResponse(saved, requester);
    }

    public List<PostResponse> getPostsByUserId(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        return postRepository.findByAuthorIdVisiblePublishedOrderByCreatedAtDesc(userId)
                .stream()
                .map(p -> buildResponse(p, null))
                .toList();
    }

    public PostResponse addTagToPost(Long postId, Long tagId, User requester) {
        boolean isModerator = requester.getRole() == Role.MODERATOR || requester.getRole() == Role.ADMIN;
        if (!isModerator) {
            throw new AccessDeniedException("Only moderators can assign tags to posts");
        }
        // In DynamoDB, tags are just strings in a list on the post — no separate Tag entity
        throw new UnsupportedOperationException(
                "Use the 'tags' field in the post creation request instead. " +
                "Tag IDs are not used in the DynamoDB model; pass tag names as strings.");
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return (User) auth.getPrincipal();
    }

    private PostResponse buildResponse(PostItem post, User currentUser) {
        boolean hasUpvoted = currentUser != null &&
                upvoteRepository.existsByPostIdAndUserId(post.getPostId(), currentUser.getId());
        return PostResponse.fromItem(post, hasUpvoted);
    }

    private String resolveContent(String content, String description) {
        return (content == null || content.isBlank()) ? description : content;
    }

    private String resolveSlugSource(String slug, String title) {
        return (slug != null && !slug.isBlank()) ? slug : title;
    }

    private String ensureUniqueSlug(String source) {
        String base = slugify(source);
        if (!postRepository.existsBySlug(base)) return base;
        int suffix = 2;
        String candidate = base;
        while (postRepository.existsBySlug(candidate)) {
            candidate = base + "-" + suffix++;
        }
        return candidate;
    }

    private String slugify(String value) {
        if (value == null) return "post";
        String slug = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (slug.isBlank()) return "post";
        return slug.length() > 240 ? slug.substring(0, 240) : slug;
    }

    private List<String> normalizeTags(List<String> tags) {
        if (tags == null) return List.of();
        return tags.stream()
                .filter(t -> t != null && !t.isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }
}
