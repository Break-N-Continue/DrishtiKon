-- OTP verifications table
CREATE TABLE otp_verifications (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otp_email ON otp_verifications(email);
CREATE INDEX idx_otp_expiry ON otp_verifications(expiry_time);

-- Drop Azure-specific columns from users (no longer needed)
ALTER TABLE users DROP COLUMN IF EXISTS azure_oid;
ALTER TABLE users DROP COLUMN IF EXISTS profile_picture_url;
