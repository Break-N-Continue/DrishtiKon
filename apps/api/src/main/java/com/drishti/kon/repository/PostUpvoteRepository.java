package com.drishti.kon.repository;

import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.PostUpvote;
import com.drishti.kon.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostUpvoteRepository extends JpaRepository<PostUpvote, Long> {

    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    long countByPost(Post post);

}
