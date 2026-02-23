-- =====================================================
-- V4: Complete schema redesign per ticket requirements
-- =====================================================

-- -------------------------------------------------------
-- 1. Alter USERS table
--    Old: id, email, first_name, last_name, role (VARCHAR), created_at, updated_at
--    New: id, email, display_name, reg_no, year_of_study, about, role (enum-like), is_banned, created_at
-- -------------------------------------------------------

-- Add new columns
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);
ALTER TABLE users ADD COLUMN reg_no VARCHAR(50);
ALTER TABLE users ADD COLUMN year_of_study INTEGER;
ALTER TABLE users ADD COLUMN about TEXT;
ALTER TABLE users ADD COLUMN is_banned BOOLEAN NOT NULL DEFAULT FALSE;

-- Migrate existing data: combine first_name + last_name into display_name
UPDATE users SET display_name = TRIM(CONCAT(first_name, ' ', last_name));

-- Migrate role values: map old 'USER' to 'STUDENT'
UPDATE users SET role = 'STUDENT' WHERE role = 'USER' OR role IS NULL;

-- Drop old columns
ALTER TABLE users DROP COLUMN IF EXISTS first_name;
ALTER TABLE users DROP COLUMN IF EXISTS last_name;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;

-- Add constraint to enforce valid role values
ALTER TABLE users ADD CONSTRAINT chk_users_role
    CHECK (role IN ('STUDENT', 'STUDENT_COUNCIL', 'TEACHER', 'MODERATOR', 'ADMIN'));

-- -------------------------------------------------------
-- 2. Alter POSTS table
--    Add: is_visible, expires_at
--    Drop: updated_at
-- -------------------------------------------------------
ALTER TABLE posts ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE posts ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE posts DROP COLUMN IF EXISTS updated_at;

-- -------------------------------------------------------
-- 3. Create COMMENTS table
-- -------------------------------------------------------
CREATE TABLE comments (
    id          BIGSERIAL PRIMARY KEY,
    post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id   BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    text        TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- -------------------------------------------------------
-- 4. Create UPVOTES table
-- -------------------------------------------------------
CREATE TABLE upvotes (
    id       BIGSERIAL PRIMARY KEY,
    post_id  BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_upvote_post_user UNIQUE (post_id, user_id)
);

CREATE INDEX idx_upvotes_post_id ON upvotes(post_id);
CREATE INDEX idx_upvotes_user_id ON upvotes(user_id);

-- -------------------------------------------------------
-- 5. Create TAGS table
-- -------------------------------------------------------
CREATE TABLE tags (
    id    BIGSERIAL PRIMARY KEY,
    name  VARCHAR(100) NOT NULL UNIQUE
);

-- -------------------------------------------------------
-- 6. Create POST_TAGS join table
-- -------------------------------------------------------
CREATE TABLE post_tags (
    post_id  BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id   BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- -------------------------------------------------------
-- 7. Create PROFILE_UPDATE_REQUESTS table
-- -------------------------------------------------------
CREATE TABLE profile_update_requests (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requested_name  VARCHAR(255),
    requested_year  INTEGER,
    status          VARCHAR(10) NOT NULL DEFAULT 'PENDING'
                        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profile_update_requests_user_id ON profile_update_requests(user_id);
CREATE INDEX idx_profile_update_requests_status ON profile_update_requests(status);

-- -------------------------------------------------------
-- 8. Create APP_CONFIG table
-- -------------------------------------------------------
CREATE TABLE app_config (
    id            BIGSERIAL PRIMARY KEY,
    config_key    VARCHAR(255) NOT NULL UNIQUE,
    config_value  TEXT
);
