package com.drishti.kon.repository;

import com.drishti.kon.entity.PostTag;
import com.drishti.kon.entity.PostTagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostTagRepository extends JpaRepository<PostTag, PostTagId> {
    List<PostTag> findByPostId(Long postId);
    List<PostTag> findByTagId(Long tagId);
    void deleteByPostId(Long postId);
    void deleteByTagId(Long tagId);
}
