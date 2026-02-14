-- Initialize database if it doesn't exist
CREATE DATABASE drishti_kon;

-- Create user if it doesn't exist  
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles 
      WHERE  rolname = 'drishti') THEN

      CREATE ROLE drishti LOGIN PASSWORD 'password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE drishti_kon TO drishti;