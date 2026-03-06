ALTER TABLE upvotes
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX idx_upvotes_user_created_at ON upvotes(user_id, created_at DESC);
