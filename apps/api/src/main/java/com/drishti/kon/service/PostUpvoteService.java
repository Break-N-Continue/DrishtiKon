package com.drishti.kon.service;

import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.Upvote;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.PostRepository;
import com.drishti.kon.repository.PostUpvoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostUpvoteService {

    private final PostRepository postRepository;
    private final PostUpvoteRepository postUpvoteRepository;

    public PostUpvoteService(PostRepository postRepository, PostUpvoteRepository postUpvoteRepository) {
        this.postRepository = postRepository;
        this.postUpvoteRepository = postUpvoteRepository;
    }

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

        Upvote upvote = new Upvote();
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
