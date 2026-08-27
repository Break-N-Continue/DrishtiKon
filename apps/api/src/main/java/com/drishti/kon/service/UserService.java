package com.drishti.kon.service;

import com.drishti.kon.dynamo.UserItem;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.UserRepository;
import com.drishti.kon.util.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final UserUtil userUtil;

    public UserService(UserRepository userRepository, UserUtil userUtil) {
        this.userRepository = userRepository;
        this.userUtil = userUtil;
    }

    public User findOrCreateByEmail(String email) {
        Optional<UserItem> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            log.debug("Found existing user: {}", email);
            return User.fromItem(existing.get());
        }

        log.info("Creating new user: {}", email);
        User newUser = new User();
        newUser.setId(System.currentTimeMillis()); // monotonic ID for DynamoDB
        newUser.setEmail(email.toLowerCase());
        newUser.setRole(Role.STUDENT);
        newUser.setCreatedAt(OffsetDateTime.now());

        // Derive display name from email local part
        String localPart = email.split("@")[0];
        String namePart = localPart.contains("_") ? localPart.split("_")[0] : localPart;
        newUser.setDisplayName(capitalizeFirst(namePart));

        userUtil.setRegNoAndYearOfStudy(newUser);

        userRepository.save(newUser.toItem());
        return newUser;
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id).map(User::fromItem);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email).map(User::fromItem);
    }

    private String capitalizeFirst(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }
}
