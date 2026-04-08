package com.drishti.kon.scheduler;

import com.drishti.kon.entity.User;
import com.drishti.kon.repository.UserRepository;
import com.drishti.kon.util.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class UserUpdateScheduler {

    private static final Logger log = LoggerFactory.getLogger(UserUpdateScheduler.class);

    private final UserRepository userRepository;
    private final UserUtil userUtil;

    public UserUpdateScheduler(UserRepository userRepository, UserUtil userUtil) {
        this.userRepository = userRepository;
        this.userUtil = userUtil;
    }

    @Scheduled(fixedRate = 3600000) // Run once every hour
    @Transactional
    public void updateUserRegNoAndYearOfStudy() {
        log.info("Starting scheduled task to update user registration numbers and year of study...");
        List<User> users = userRepository.findAll();
        for (User user : users) {
            userUtil.setRegNoAndYearOfStudy(user);
            userRepository.save(user);
        }
        log.info("Finished updating user registration numbers and year of study for {} users.", users.size());
    }
}
