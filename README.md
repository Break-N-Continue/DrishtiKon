# DrishtiKon

A simple CRUD community platform — **Next.js** frontend + **Spring Boot** API + **PostgreSQL**.

## Quick Start (Docker)

```bash
docker compose up -d
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api/posts
- **Health**: http://localhost:8080/api/health

## Local Development

### Prerequisites

- Node.js 18+
- Java 21
- Docker (for PostgreSQL)

### Run

```bash
# Start the database
docker compose up -d postgres

# Start the API (in apps/api/)
cd apps/api && ./mvnw spring-boot:run

# Start the frontend (in apps/web/)
cd apps/web && npm install && npm run dev
```

## Project Structure

```
apps/
  api/          → Spring Boot REST API (Java 21)
  web/          → Next.js frontend (React + Tailwind)
docker-compose.yml
```

## API Endpoints

| Method | Path             | Description       |
|--------|------------------|-------------------|
| GET    | /api/posts       | List all posts    |
| GET    | /api/posts/:id   | Get a post        |
| POST   | /api/posts       | Create a post     |
| PUT    | /api/posts/:id   | Update a post     |
| DELETE | /api/posts/:id   | Delete a post     |
| GET    | /api/health      | Health check      |

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Axios
- **Backend**: Spring Boot 3.2, Spring Data JPA, Flyway
- **Database**: PostgreSQL 15
- **Containerization**: Docker
