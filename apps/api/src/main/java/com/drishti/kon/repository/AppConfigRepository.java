package com.drishti.kon.repository;

import com.drishti.kon.entity.AppConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppConfigRepository extends JpaRepository<AppConfig, Long> {
    Optional<AppConfig> findByKey(String key);
    boolean existsByKey(String key);
}
