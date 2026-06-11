package com.drishti.kon.service;

import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.PostUpvote;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.PostUpvoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostUpvoteService {

    private final PostRepository postRepository;
    private final PostUpvoteRepository postUpvoteRepository;

    @Transactional
    public boolean toggleUpvote(Long postId, User user) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean alreadyUpvoted =
                postUpvoteRepository.existsByUserAndPost(user, post);

        if (alreadyUpvoted) {
            postUpvoteRepository.deleteByUserAndPost(user, post);
            return false; // now not upvoted
        }

        PostUpvote upvote = new PostUpvote();
        upvote.setUser(user);
        upvote.setPost(post);

        postUpvoteRepository.save(upvote);

        return true; // now upvoted
    }

    public long getUpvoteCount(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return postUpvoteRepository.countByPost(post);
    }

}
