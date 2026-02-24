package com.drishti.kon.repository;

import com.drishti.kon.entity.ProfileUpdateRequest;
import com.drishti.kon.entity.ProfileUpdateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileUpdateRequestRepository extends JpaRepository<ProfileUpdateRequest, Long> {
    List<ProfileUpdateRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ProfileUpdateRequest> findByStatusOrderByCreatedAtAsc(ProfileUpdateStatus status);
    boolean existsByUserIdAndStatus(Long userId, ProfileUpdateStatus status);
}
