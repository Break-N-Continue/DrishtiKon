package com.drishti.kon.repository;

import com.drishti.kon.dto.UserProfileCommentResponse;
import com.drishti.kon.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    List<Comment> findByPostIdAndParentIsNullOrderByCreatedAtAsc(Long postId);
    List<Comment> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
    Optional<Comment> findByIdAndPostId(Long id, Long postId);

    @Query("SELECT c FROM Comment c JOIN FETCH c.author LEFT JOIN FETCH c.parent WHERE c.post.id = :postId ORDER BY c.createdAt ASC")
    List<Comment> findByPostIdWithAuthorAndParent(@Param("postId") Long postId);

    @Query("""
            SELECT new com.drishti.kon.dto.UserProfileCommentResponse(
                c.id,
                c.text,
                c.createdAt,
                p.id,
                p.title
            )
            FROM Comment c
            JOIN c.post p
            WHERE c.author.id = :authorId
              AND p.isVisible = true
            ORDER BY c.createdAt DESC
            """)
    Page<UserProfileCommentResponse> findUserVisibleCommentsWithPostInfo(@Param("authorId") Long authorId, Pageable pageable);
}
