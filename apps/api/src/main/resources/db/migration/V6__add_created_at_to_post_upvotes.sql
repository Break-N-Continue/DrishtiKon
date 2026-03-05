ALTER TABLE post_upvotes
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_post_upvotes_user_created_at
    ON post_upvotes (user_id, created_at DESC);
