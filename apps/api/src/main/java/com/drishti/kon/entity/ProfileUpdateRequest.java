package com.drishti.kon.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "profile_update_requests")
public class ProfileUpdateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "requested_name")
    private String requestedName;

    @Column(name = "requested_year")
    private Integer requestedYear;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ProfileUpdateStatus status = ProfileUpdateStatus.PENDING;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRequestedName() { return requestedName; }
    public void setRequestedName(String requestedName) { this.requestedName = requestedName; }

    public Integer getRequestedYear() { return requestedYear; }
    public void setRequestedYear(Integer requestedYear) { this.requestedYear = requestedYear; }

    public ProfileUpdateStatus getStatus() { return status; }
    public void setStatus(ProfileUpdateStatus status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
}
