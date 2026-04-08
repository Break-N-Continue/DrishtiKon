package com.drishti.kon.service;

import com.drishti.kon.dto.TagRequest;
import com.drishti.kon.dto.TagResponse;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.Tag;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostTagRepository;
import com.drishti.kon.repository.TagRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final PostTagRepository postTagRepository;

    public TagService(TagRepository tagRepository, PostTagRepository postTagRepository) {
        this.tagRepository = tagRepository;
        this.postTagRepository = postTagRepository;
    }

    @Transactional(readOnly = true)
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TagResponse createTag(TagRequest request, User requester) {
        requireModerator(requester);

        String name = request.getName().trim();
        if (tagRepository.existsByNameIgnoreCase(name)) {
            throw new RuntimeException("Tag already exists: " + name);
        }

        Tag tag = new Tag();
        tag.setName(name);
        Tag saved = tagRepository.save(tag);
        return TagResponse.fromEntity(saved);
    }

    @Transactional
    public void deleteTag(Long id, User requester) {
        requireModerator(requester);

        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + id));

        postTagRepository.deleteByTagId(tag.getId());
        tagRepository.delete(tag);
    }

    private void requireModerator(User user) {
        if (user.getRole() != Role.MODERATOR && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only moderators can perform this action");
        }
    }
}
