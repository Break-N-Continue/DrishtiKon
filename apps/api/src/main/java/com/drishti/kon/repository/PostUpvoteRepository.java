package com.drishti.kon.repository;

import com.drishti.kon.entity.Post;
import com.drishti.kon.entity.PostUpvote;
import com.drishti.kon.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostUpvoteRepository extends JpaRepository<PostUpvote, Long> {

    boolean existsByUserAndPost(User user, Post post);
    void deleteByUserAndPost(User user, Post post);
    long countByPost(Post post);
    @Query("""
            SELECT pu.post
            FROM PostUpvote pu
            JOIN pu.post p
            WHERE pu.user.id = :userId
              AND p.isVisible = true
            ORDER BY pu.createdAt DESC
            """)
    Page<Post> findVisibleUpvotedPostsByUserIdOrderByUpvotedAtDesc(@Param("userId") Long userId, Pageable pageable);

}
