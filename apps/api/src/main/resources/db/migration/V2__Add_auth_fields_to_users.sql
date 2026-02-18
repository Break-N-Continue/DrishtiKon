-- Add Azure AD authentication fields to users table
ALTER TABLE users ADD COLUMN azure_oid VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN profile_picture_url VARCHAR(500);
ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'USER';
