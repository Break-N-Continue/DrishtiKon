package com.drishti.kon.service;

import com.drishti.kon.dto.TagRequest;
import com.drishti.kon.dto.TagResponse;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;

/**
 * Tag management service.
 *
 * In DynamoDB, tags are stored as a List<String> directly on PostItem.
 * There is no separate Tag table. Tag "creation" means ensuring a tag string
 * is used in at least one post. Listing tags scans all posts and collects
 * distinct tag strings.
 *
 * For a college community scale this is acceptable. For higher scale, maintain
 * a separate TAG# item in the same DynamoDB table.
 */
@Service
public class TagService {

    private final PostRepository postRepository;

    public TagService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /** Returns all distinct tags used across all visible posts. */
    public List<TagResponse> getAllTags() {
        return postRepository.findAllVisiblePublishedOrderByCreatedAtDesc().stream()
                .filter(p -> p.getTags() != null)
                .flatMap(p -> p.getTags().stream())
                .distinct()
                .sorted()
                .map(name -> new TagResponse(null, name))
                .toList();
    }

    /**
     * Tags are created implicitly when used in posts.
     * This endpoint now returns the tag name as-is for moderator UI compatibility.
     */
    public TagResponse createTag(TagRequest request, User requester) {
        requireModerator(requester);
        String name = request.getName().trim();
        return new TagResponse(null, name);
    }

    /**
     * Delete a tag — removes it from all posts that use it.
     * This is a scan-and-update operation; acceptable for a college-community scale.
     */
    public void deleteTag(Long id, User requester) {
        requireModerator(requester);
        // For DynamoDB, tag deletion by numeric ID is not applicable.
        // Tags are plain strings; this is a no-op unless tag names are used.
        throw new UnsupportedOperationException(
                "In the DynamoDB model, tags are plain strings embedded in posts. " +
                "To remove a tag, update each post that uses it.");
    }

    private void requireModerator(User user) {
        if (user.getRole() != Role.MODERATOR && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only moderators can perform this action");
        }
    }
}
