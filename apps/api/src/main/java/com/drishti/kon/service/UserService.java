package com.drishti.kon.service;

import com.drishti.kon.entity.User;
import com.drishti.kon.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User findOrCreateUser(String email, String name, String azureOid) {
        // First try to find by Azure OID
        Optional<User> existingByOid = userRepository.findByAzureOid(azureOid);
        if (existingByOid.isPresent()) {
            log.debug("Found existing user by Azure OID: {}", azureOid);
            return updateUserIfNeeded(existingByOid.get(), email, name);
        }

        // Then try to find by email
        Optional<User> existingByEmail = userRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            log.debug("Found existing user by email: {}, linking Azure OID", email);
            User user = existingByEmail.get();
            user.setAzureOid(azureOid);
            return updateUserIfNeeded(user, email, name);
        }

        // Create new user
        log.info("Creating new user: email={}, oid={}", email, azureOid);
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setAzureOid(azureOid);
        newUser.setRole("USER");

        if (name != null && !name.isBlank()) {
            String[] parts = name.trim().split("\\s+", 2);
            newUser.setFirstName(parts[0]);
            newUser.setLastName(parts.length > 1 ? parts[1] : "");
        } else {
            newUser.setFirstName(email.split("@")[0]);
            newUser.setLastName("");
        }

        return userRepository.save(newUser);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    private User updateUserIfNeeded(User user, String email, String name) {
        boolean changed = false;

        if (name != null && !name.isBlank()) {
            String[] parts = name.trim().split("\\s+", 2);
            String firstName = parts[0];
            String lastName = parts.length > 1 ? parts[1] : "";

            if (!firstName.equals(user.getFirstName())) {
                user.setFirstName(firstName);
                changed = true;
            }
            if (!lastName.equals(user.getLastName())) {
                user.setLastName(lastName);
                changed = true;
            }
        }

        if (changed) {
            return userRepository.save(user);
        }
        return user;
    }
}
