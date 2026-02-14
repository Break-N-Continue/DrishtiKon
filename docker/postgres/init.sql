-- Initialize database if it doesn't exist
SELECT 'CREATE DATABASE drishti_kon'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'drishti_kon')\gexec

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