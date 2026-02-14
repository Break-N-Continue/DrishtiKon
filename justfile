# DrishtiKon - Project Commands
# Usage: just <recipe>

# Show available commands
default:
    @just --list

# ─── Development ──────────────────────────────────────────

# Run frontend dev server (Next.js on port 3000)
frontend-dev:
    cd apps/web && ../../node_modules/.bin/next dev -p 3000

# Run backend dev server (Spring Boot on port 8080)
# Automatically starts PostgreSQL if not already running
backend-dev: _ensure-db
    cd apps/api && ./mvnw spring-boot:run -Dspring-boot.run.profiles=development

# Run both frontend and backend in parallel
dev: _ensure-db
    just frontend-dev & just backend-dev & wait

# (internal) Ensure PostgreSQL is running and healthy
_ensure-db:
    #!/usr/bin/env bash
    set -euo pipefail
    if ! docker ps --format '{{"{{.Names}}"}}' | grep -q drishti-kon-db; then
        echo "Starting PostgreSQL..."
        docker compose up -d postgres
    fi
    echo "Waiting for PostgreSQL to be healthy..."
    until docker inspect --format='{{"{{.State.Health.Status}}"}}' drishti-kon-db 2>/dev/null | grep -q healthy; do
        sleep 1
    done
    echo "PostgreSQL is ready."

# ─── Database ─────────────────────────────────────────────

# Start PostgreSQL container
db-up:
    docker compose up -d postgres

# Stop PostgreSQL container
db-down:
    docker compose stop postgres

# Reset database (drop and recreate)
db-reset:
    docker compose down postgres -v
    docker compose up -d postgres
    @echo "Waiting for PostgreSQL to be healthy..."
    @sleep 5

# Open psql shell
db-shell:
    docker exec -it drishti-kon-db psql -U drishti -d drishti_kon

# ─── Build ────────────────────────────────────────────────

# Build frontend
frontend-build:
    cd apps/web && npx next build

# Build backend JAR
backend-build:
    cd apps/api && ./mvnw clean package -DskipTests

# Build everything
build: frontend-build backend-build

# ─── Dependencies ─────────────────────────────────────────

# Install all dependencies
install:
    npm install
    node scripts/patch-next.js
    cd apps/api && ./mvnw dependency:resolve

# Install frontend dependencies only
frontend-install:
    cd apps/web && npm install

# ─── Clean ────────────────────────────────────────────────

# Clean all build artifacts
clean:
    rm -rf apps/web/.next apps/web/.turbo
    cd apps/api && ./mvnw clean

# Clean everything including node_modules
clean-all: clean
    rm -rf node_modules apps/web/node_modules

# ─── Docker ───────────────────────────────────────────────

# Start all services with Docker Compose
docker-up:
    docker compose up -d

# Stop all Docker services
docker-down:
    docker compose down

# View Docker logs
docker-logs service="":
    docker compose logs -f {{service}}
