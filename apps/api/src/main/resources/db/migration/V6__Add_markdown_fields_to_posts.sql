-- =====================================================
-- V6: Add markdown-related fields to posts
-- =====================================================

ALTER TABLE posts
    ADD COLUMN content TEXT,
    ADD COLUMN slug VARCHAR(255),
    ADD COLUMN cover_image_url VARCHAR(500),
    ADD COLUMN is_draft BOOLEAN NOT NULL DEFAULT FALSE;

-- Backfill content for existing rows
UPDATE posts
SET content = description
WHERE content IS NULL;

-- Generate a base slug from existing titles
UPDATE posts
SET slug = lower(regexp_replace(title, '[^a-z0-9]+', '-', 'g'));

UPDATE posts
SET slug = trim(both '-' from slug);

-- Ensure slugs are non-empty and unique by appending the id when needed
UPDATE posts
SET slug = CONCAT(
    LEFT(COALESCE(NULLIF(slug, ''), 'post'), 240),
    '-',
    id
)
WHERE slug IS NULL
   OR slug = ''
   OR id IN (
        SELECT id
        FROM (
            SELECT id,
                   slug,
                   COUNT(*) OVER (PARTITION BY slug) AS slug_count
            FROM posts
        ) AS dedupe
        WHERE dedupe.slug_count > 1
   );

ALTER TABLE posts ALTER COLUMN content SET NOT NULL;
ALTER TABLE posts ALTER COLUMN slug SET NOT NULL;
ALTER TABLE posts ADD CONSTRAINT uq_posts_slug UNIQUE (slug);
