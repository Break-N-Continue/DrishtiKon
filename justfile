# DrishtiKon - Development Commands

# Run frontend in dev mode
frontend-dev:
    cd apps/web && npm install && npm run dev

# Run backend with all prerequisites (postgres + api)
backend-dev:
    docker compose up -d postgres
    @echo "Waiting for Postgres to be ready..."
    @sleep 5
    cd apps/api && ./mvnw spring-boot:run

# Start everything with docker compose
up:
    docker compose up -d

# Stop everything
down:
    docker compose down

# Build and start
build:
    docker compose build
    docker compose up -d

# Start only the database
db:
    docker compose up -d postgres

# Stop the database
db-down:
    docker compose down postgres

# Start the web frontend (dev mode)
dev-web:
    cd apps/web && npm run dev

# Start the API backend (dev mode)
dev-api:
    cd apps/api && ./mvnw spring-boot:run

# Start both frontend and backend in dev mode
dev:
    just dev-api &
    just dev-web

# Build the API jar
build-api:
    cd apps/api && ./mvnw clean package -DskipTests

# Build the web app
build-web:
    cd apps/web && npm run build

# View API logs
logs-api:
    docker logs -f drishti-api

# View web logs
logs-web:
    docker logs -f drishti-web

# View database logs
logs-db:
    docker logs -f drishti-db

# View all logs
logs:
    docker compose logs -f

# Reset database (delete volume and restart)
db-reset:
    docker compose down -v
    docker compose up -d postgres

# Clean everything (containers, volumes, images)
clean:
    docker compose down -v --rmi local

# Check API health
health:
    curl -s http://localhost:8080/api/health | head
