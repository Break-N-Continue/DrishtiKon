package com.drishti.kon.scheduler;

import com.drishti.kon.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Component
public class PostExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(PostExpiryScheduler.class);

    private final PostRepository postRepository;

    public PostExpiryScheduler(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    /**
     * Runs every 5 minutes. Sets isVisible=false for posts where expiresAt < now().
     */
    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    @Transactional
    public void expirePosts() {
        int expiredCount = postRepository.expirePostsBefore(OffsetDateTime.now());
        if (expiredCount > 0) {
            log.info("Expired {} post(s) that passed their expiresAt time", expiredCount);
        }
    }
}
