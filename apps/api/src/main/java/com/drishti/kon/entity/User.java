package com.drishti.kon.entity;

import com.drishti.kon.dynamo.UserItem;

import java.time.OffsetDateTime;

/**
 * Application-level User model (plain Java class — no JPA annotations).
 *
 * This is the object placed in the Spring Security context and passed to
 * controllers via {@code @CurrentUser}. It is populated from {@link UserItem}
 * retrieved from DynamoDB.
 */
public class User {

    private Long id;
    private String email;
    private String displayName;
    private String regNo;
    private Integer yearOfStudy;
    private String about;
    private Role role = Role.STUDENT;
    private boolean isBanned = false;
    private OffsetDateTime createdAt;

    public User() {}

    /**
     * Converts a DynamoDB {@link UserItem} into the application User model.
     */
    public static User fromItem(UserItem item) {
        User user = new User();
        user.setId(item.getUserId());
        user.setEmail(item.getEmail());
        user.setDisplayName(item.getDisplayName());
        user.setRegNo(item.getRegNo());
        user.setYearOfStudy(item.getYearOfStudy());
        user.setAbout(item.getAbout());
        user.setRole(item.getRole() != null ? Role.valueOf(item.getRole()) : Role.STUDENT);
        user.setBanned(item.isBanned());
        if (item.getCreatedAt() != null) {
            user.setCreatedAt(OffsetDateTime.parse(item.getCreatedAt()));
        }
        return user;
    }

    /**
     * Converts this User into a {@link UserItem} for DynamoDB persistence.
     */
    public UserItem toItem() {
        UserItem item = new UserItem();
        item.setUserId(this.id);
        item.setEmail(this.email != null ? this.email.toLowerCase() : null);
        item.setDisplayName(this.displayName);
        item.setRegNo(this.regNo);
        item.setYearOfStudy(this.yearOfStudy);
        item.setAbout(this.about);
        item.setRole(this.role != null ? this.role.name() : Role.STUDENT.name());
        item.setBanned(this.isBanned);
        item.setPk(UserItem.buildPk(this.email));
        item.setSk("METADATA");
        item.setGsi1Pk(UserItem.buildGsi1Pk(this.id));
        item.setGsi1Sk("METADATA");
        if (this.createdAt != null) {
            item.setCreatedAt(this.createdAt.toString());
        }
        return item;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getRegNo() { return regNo; }
    public void setRegNo(String regNo) { this.regNo = regNo; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isBanned() { return isBanned; }
    public void setBanned(boolean banned) { isBanned = banned; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
