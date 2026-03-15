package com.drishti.kon.service;

import com.drishti.kon.dto.LinksResponse;
import com.drishti.kon.dto.UpdateLinksRequest;
import com.drishti.kon.entity.AppConfig;
import com.drishti.kon.entity.Role;
import com.drishti.kon.entity.User;
import com.drishti.kon.repository.AppConfigRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppConfigService {

    static final String KEY_BUG_REPORT_URL = "bugReportUrl";
    static final String KEY_FEATURE_REQUEST_URL = "featureRequestUrl";
    static final String KEY_REPORT_POST_URL = "reportPostUrl";

    private final AppConfigRepository appConfigRepository;

    public AppConfigService(AppConfigRepository appConfigRepository) {
        this.appConfigRepository = appConfigRepository;
    }

    @Transactional(readOnly = true)
    public LinksResponse getLinks() {
        String bugReportUrl = getValue(KEY_BUG_REPORT_URL);
        String featureRequestUrl = getValue(KEY_FEATURE_REQUEST_URL);
        String reportPostUrl = getValue(KEY_REPORT_POST_URL);
        return new LinksResponse(bugReportUrl, featureRequestUrl, reportPostUrl);
    }

    @Transactional
    public LinksResponse updateLinks(UpdateLinksRequest request, User requester) {
        requireModerator(requester);

        if (request.getBugReportUrl() != null) {
            setValue(KEY_BUG_REPORT_URL, request.getBugReportUrl());
        }
        if (request.getFeatureRequestUrl() != null) {
            setValue(KEY_FEATURE_REQUEST_URL, request.getFeatureRequestUrl());
        }
        if (request.getReportPostUrl() != null) {
            setValue(KEY_REPORT_POST_URL, request.getReportPostUrl());
        }

        return getLinks();
    }

    private String getValue(String key) {
        return appConfigRepository.findByKey(key)
                .map(AppConfig::getValue)
                .orElse(null);
    }

    private void setValue(String key, String value) {
        AppConfig config = appConfigRepository.findByKey(key)
                .orElseGet(() -> {
                    AppConfig c = new AppConfig();
                    c.setKey(key);
                    return c;
                });
        config.setValue(value);
        appConfigRepository.save(config);
    }

    private void requireModerator(User user) {
        if (user.getRole() != Role.MODERATOR && user.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only moderators can perform this action");
        }
    }
}
