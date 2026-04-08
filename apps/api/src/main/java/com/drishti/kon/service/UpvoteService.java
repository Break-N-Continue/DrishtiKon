package com.drishti.kon.service;

import com.drishti.kon.dto.ToggleUpvoteResponse;
import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.Upvote;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.UpvoteRepository;
import com.drishti.kon.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ToggleUpvoteResponse togglePostUpvote(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        if (!post.isVisible()) {
            throw new RuntimeException("Post not found with id: " + postId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        boolean upvoted;
        Upvote existingUpvote = upvoteRepository.findByPostIdAndUserId(postId, userId).orElse(null);

        if (existingUpvote != null) {
            upvoteRepository.delete(existingUpvote);
            upvoted = false;
        } else {
            Upvote upvote = new Upvote();
            upvote.setPost(post);
            upvote.setUser(user);
            upvoteRepository.save(upvote);
            upvoted = true;
        }

        long upvoteCount = upvoteRepository.countByPostId(postId);
        return new ToggleUpvoteResponse(upvoted, upvoteCount);
    }
}
