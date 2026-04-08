package com.drishti.kon.config;

import com.drishti.kon.entity.AppConfig;
import com.drishti.kon.repository.AppConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * Seeds default placeholder values for app config link entries on first startup.
 * Existing values are never overwritten.
 */
@Component
@Order(2)
public class AppConfigSeedRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AppConfigSeedRunner.class);

    private static final Map<String, String> DEFAULT_LINKS = Map.of(
            "bugReportUrl",       "https://docs.google.com/forms/d/e/1FAIpQLSeh_KMbPhzDiaitBZak6h4iCGK7SR7GIfe6a9HbvEioS7I9WQ/viewform?usp=publish-editor",
            "featureRequestUrl",  "https://docs.google.com/forms/d/e/1FAIpQLSehV9MdNr462VEWWTJcGBuT0qIWGqDvxg_lg6kE5F3ZEfxFIQ/viewform?usp=publish-editor",
            "reportPostUrl",      "https://docs.google.com/forms/d/e/1FAIpQLSfb97lsWkWQA-55A4yI5-vJIgz69gP9gDbcCdzhzZFF3LzH-Q/viewform?usp=publish-editor"
    );

    private final AppConfigRepository appConfigRepository;

    public AppConfigSeedRunner(AppConfigRepository appConfigRepository) {
        this.appConfigRepository = appConfigRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (Map.Entry<String, String> entry : DEFAULT_LINKS.entrySet()) {
            String key = entry.getKey();
            if (!appConfigRepository.existsByKey(key)) {
                AppConfig config = new AppConfig();
                config.setKey(key);
                config.setValue(entry.getValue());
                appConfigRepository.save(config);
                log.info("Seeded default app config: {} = {}", key, entry.getValue());
            }
        }
    }
}
