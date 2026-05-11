package com.drishti.kon.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "is_draft", nullable = false)
    private boolean isDraft = false;

    @Column(name = "is_visible", nullable = false)
    private boolean isVisible = true;

    @Column(name = "expires_at")
    private OffsetDateTime expiresAt;

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Upvote> upvotes = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostTag> postTags = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = OffsetDateTime.now();
        if (slug == null || slug.isBlank()) {
            slug = slugify(title);
        }
    }

    private String slugify(String value) {
        if (value == null) {
            return "post";
        }
        String slugValue = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slugValue.isBlank() ? "post" : slugValue;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public boolean isDraft() { return isDraft; }
    public void setDraft(boolean draft) { isDraft = draft; }

    public boolean isVisible() { return isVisible; }
    public void setVisible(boolean visible) { isVisible = visible; }

    public OffsetDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(OffsetDateTime expiresAt) { this.expiresAt = expiresAt; }

    public OffsetDateTime getCreatedAt() { return createdAt; }

    public List<Comment> getComments() { return comments; }
    public void setComments(List<Comment> comments) { this.comments = comments; }

    public List<Upvote> getUpvotes() { return upvotes; }
    public void setUpvotes(List<Upvote> upvotes) { this.upvotes = upvotes; }

    public List<PostTag> getPostTags() { return postTags; }
    public void setPostTags(List<PostTag> postTags) { this.postTags = postTags; }
}
