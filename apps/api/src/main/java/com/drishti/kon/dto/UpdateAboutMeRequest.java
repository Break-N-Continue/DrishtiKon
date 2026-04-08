package com.drishti.kon.dto;

import jakarta.validation.constraints.Size;

public class UpdateAboutMeRequest {
    @Size(max = 500, message = "About me cannot be longer than 500 characters")
    private String aboutMe;

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }
}
