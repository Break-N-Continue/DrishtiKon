package com.drishti.kon.util;

import com.drishti.kon.entity.User;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class UserUtil {

    private static final Pattern REG_NO_PATTERN = Pattern.compile("_(.*?)@");
    private static final String REG_NO_NOT_AVAILABLE = "NA";
    private static final int YEAR_OF_STUDY_NOT_AVAILABLE = -1;
    private static final int GRADUATION_YEAR_OFFSET = 4;

    public void setRegNoAndYearOfStudy(User user) {
        if (user == null || user.getEmail() == null) {
            setNotAvailable(user);
            return;
        }

        Matcher matcher = REG_NO_PATTERN.matcher(user.getEmail());
        if (!matcher.find()) {
            setNotAvailable(user);
            return;
        }

        String regNo = matcher.group(1);
        if (regNo == null || regNo.length() < 2) {
            setNotAvailable(user);
            return;
        }

        try {
            int regYear = Integer.parseInt(regNo.substring(0, 2));
            int graduationYear = 2000 + regYear + GRADUATION_YEAR_OFFSET;
            user.setRegNo(regNo);
            user.setYearOfStudy(graduationYear);
        } catch (NumberFormatException e) {
            setNotAvailable(user);
        }
    }

    private void setNotAvailable(User user) {
        if (user == null) {
            return;
        }
        user.setRegNo(REG_NO_NOT_AVAILABLE);
        user.setYearOfStudy(YEAR_OF_STUDY_NOT_AVAILABLE);
    }
}
