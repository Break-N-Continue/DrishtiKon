package com.drishti.kon.repository;

import com.drishti.kon.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    void deleteByEmail(String email);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiryTime < :now")
    void deleteExpired(OffsetDateTime now);
}
