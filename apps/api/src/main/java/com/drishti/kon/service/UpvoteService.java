package com.drishti.kon.service;

import com.drishti.kon.dto.ToggleUpvoteResponse;
import com.drishti.kon.dynamo.PostItem;
import com.drishti.kon.dynamo.UpvoteItem;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class UpvoteService {

    private final PostRepository postRepository;
    private final UpvoteRepository upvoteRepository;
    private final UserRepository userRepository;

    public UpvoteService(PostRepository postRepository,
                         UpvoteRepository upvoteRepository,
                         UserRepository userRepository) {
        this.postRepository = postRepository;
        this.upvoteRepository = upvoteRepository;
        this.userRepository = userRepository;
    }

    public ToggleUpvoteResponse togglePostUpvote(Long postId, Long userId) {
        PostItem post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }

        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean upvoted;
        Optional<UpvoteItem> existingUpvote = upvoteRepository.findByPostIdAndUserId(postId, userId);

        if (existingUpvote.isPresent()) {
            upvoteRepository.delete(existingUpvote.get());
            postRepository.updateUpvoteCount(postId, -1L);
            upvoted = false;
        } else {
            UpvoteItem upvote = new UpvoteItem();
            upvote.setPostId(postId);
            upvote.setUserId(userId);
            upvote.setCreatedAt(OffsetDateTime.now().toString());
            upvote.setPk(UpvoteItem.buildPk(postId));
            upvote.setSk(UpvoteItem.buildSk(userId));
            upvote.setGsi1Pk(UpvoteItem.buildGsi1Pk(userId));
            upvote.setGsi1Sk(UpvoteItem.buildGsi1Sk(upvote.getCreatedAt()));
            upvoteRepository.save(upvote);
            postRepository.updateUpvoteCount(postId, +1L);
            upvoted = true;
        }

        // Return the current upvote count from the de-normalized field
        PostItem refreshed = postRepository.findById(postId).orElse(post);
        long upvoteCount = refreshed.getUpvoteCount() == null ? 0L : refreshed.getUpvoteCount();
        return new ToggleUpvoteResponse(upvoted, upvoteCount);
    }
}
