package com.drishti.kon.config;

import com.drishti.kon.dynamo.UserItem;
import com.drishti.kon.entity.Role;
import com.drishti.kon.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;

/**
 * Seeds moderator-role accounts on application startup using DynamoDB.
 *
 * For every email listed under {@code app.moderators.emails}:
 *  1. If the user already exists, their role is (re)set to MODERATOR.
 *  2. If the user does not exist, a new record is created with role MODERATOR.
 */
@Component
@ConfigurationProperties(prefix = "app.moderators")
@Order(1)
public class ModeratorSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ModeratorSeedRunner.class);

    private final UserRepository userRepository;
    private List<String> emails = Collections.emptyList();

    public ModeratorSeedRunner(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails != null ? emails : Collections.emptyList();
    }

    @Override
    public void run(ApplicationArguments args) {
        if (emails == null || emails.isEmpty()) {
            log.debug("No moderator emails configured — skipping seed.");
            return;
        }

        for (String rawEmail : emails) {
            String email = rawEmail.toLowerCase().trim();
            if (email.isBlank()) continue;

            UserItem item = userRepository.findByEmail(email).orElseGet(() -> {
                log.info("Moderator seed: creating new user for {}", email);
                UserItem newItem = new UserItem();
                newItem.setUserId(System.currentTimeMillis());
                newItem.setEmail(email);
                String namePart = email.split("@")[0];
                newItem.setDisplayName(capitalizeFirst(namePart));
                newItem.setCreatedAt(OffsetDateTime.now().toString());
                newItem.setPk(UserItem.buildPk(email));
                newItem.setSk("METADATA");
                newItem.setGsi1Pk(UserItem.buildGsi1Pk(newItem.getUserId()));
                newItem.setGsi1Sk("METADATA");
                return newItem;
            });

            if (!Role.MODERATOR.name().equals(item.getRole())) {
                item.setRole(Role.MODERATOR.name());
                userRepository.save(item);
                log.info("Moderator seed: assigned MODERATOR role to {}", email);
            } else {
                log.debug("Moderator seed: {} already has MODERATOR role", email);
            }
        }
    }

    private String capitalizeFirst(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }
}
