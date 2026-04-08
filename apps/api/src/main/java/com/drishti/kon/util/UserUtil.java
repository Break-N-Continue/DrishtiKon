package com.drishti.kon.util;

import com.drishti.kon.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class UserUtil {

    private static final Pattern REG_NO_PATTERN = Pattern.compile("_(.*?)@");

    public void setRegNoAndYearOfStudy(User user) {
        if (user.getEmail() == null) {
            return;
        }

        Matcher matcher = REG_NO_PATTERN.matcher(user.getEmail());
        if (matcher.find()) {
            String regNo = matcher.group(1);
            user.setRegNo(regNo);

            if (regNo.length() >= 2) {
                try {
                    int regYear = Integer.parseInt(regNo.substring(0, 2));
                    int currentYear = LocalDate.now().getYear() % 100;
                    int yearOfStudy = currentYear - regYear ;
                    user.setYearOfStudy(yearOfStudy);
                } catch (NumberFormatException e) {
                    // Not a valid registration number year
                }
            }
        }
    }
}
