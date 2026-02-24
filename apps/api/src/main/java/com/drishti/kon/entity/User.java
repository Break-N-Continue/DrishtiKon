package com.drishti.kon.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "display_name")
    private String displayName;

    @Column(name = "reg_no")
    private String regNo;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.STUDENT;

    @Column(name = "is_banned", nullable = false)
    private boolean isBanned = false;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
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
}
