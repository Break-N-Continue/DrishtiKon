package com.drishti.kon.repository;

import com.drishti.kon.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByIsVisibleTrueOrderByCreatedAtDesc();

    Optional<Post> findByIdAndIsVisibleTrue(Long id);

    List<Post> findByAuthorIdAndIsVisibleTrueOrderByCreatedAtDesc(Long authorId);
    Page<Post> findByAuthorIdAndIsVisibleTrueOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    @Modifying
    @Query("UPDATE Post p SET p.isVisible = false WHERE p.expiresAt IS NOT NULL AND p.expiresAt < :now AND p.isVisible = true")
    int expirePostsBefore(@Param("now") OffsetDateTime now);
}
