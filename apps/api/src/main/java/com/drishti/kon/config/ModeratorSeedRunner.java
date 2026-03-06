package com.drishti.kon.config;

import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds moderator-role accounts on application startup.
 *
 * <p>For every email listed under {@code app.moderators.emails}:
 * <ol>
 *   <li>If the user already exists, their role is (re)set to {@code MODERATOR}.</li>
 *   <li>If the user does not yet exist, a new record is created with role {@code MODERATOR}.</li>
 * </ol>
 *
 * Configure the list in {@code application.yml}:
 * <pre>
 * app:
 *   moderators:
 *     emails:
 *       - admin@aitpune.edu.in
 *       - moderator@aitpune.edu.in
 * </pre>
 */
@Component
public class ModeratorSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ModeratorSeedRunner.class);

    private final UserRepository userRepository;

    @Value("${app.moderators.emails:}")
    private List<String> moderatorEmails;

    public ModeratorSeedRunner(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (moderatorEmails == null || moderatorEmails.isEmpty()) {
            log.debug("No moderator emails configured — skipping seed.");
            return;
        }

        for (String rawEmail : moderatorEmails) {
            String email = rawEmail.toLowerCase().trim();
            if (email.isBlank()) continue;

            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        log.info("Moderator seed: creating new user for {}", email);
                        User newUser = new User();
                        newUser.setEmail(email);
                        String namePart = email.split("@")[0];
                        newUser.setDisplayName(capitalizeFirst(namePart));
                        return newUser;
                    });

            if (user.getRole() != Role.MODERATOR) {
                user.setRole(Role.MODERATOR);
                userRepository.save(user);
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
