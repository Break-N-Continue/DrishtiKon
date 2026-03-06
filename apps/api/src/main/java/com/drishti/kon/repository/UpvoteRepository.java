package com.drishti.kon.repository;

import com.drishti.kon.entity.Upvote;
import com.drishti.kon.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpvoteRepository extends JpaRepository<Upvote, Long> {
    Optional<Upvote> findByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    void deleteByPostIdAndUserId(Long postId, Long userId);

    @Query("""
            SELECT u.post
            FROM Upvote u
            JOIN u.post p
            WHERE u.user.id = :userId
              AND p.isVisible = true
            ORDER BY u.createdAt DESC
            """)
    Page<Post> findVisibleUpvotedPostsByUserIdOrderByUpvoteCreatedAtDesc(@Param("userId") Long userId, Pageable pageable);
}
