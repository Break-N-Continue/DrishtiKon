package com.drishti.kon.repository;

import com.drishti.kon.entity.Upvote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UpvoteRepository extends JpaRepository<Upvote, Long> {
    Optional<Upvote> findByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    long countByPostId(Long postId);
    void deleteByPostIdAndUserId(Long postId, Long userId);
}
