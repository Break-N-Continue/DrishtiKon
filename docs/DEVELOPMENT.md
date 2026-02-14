# Development Guide

This guide helps developers set up and work with the DrishtiKon monorepo.

# Development Guide

This guide helps developers set up and work with the DrishtiKon monorepo.

## 🚀 Quick Ubuntu Setup (Complete Installation)

For Ubuntu users, here's a complete one-command setup to install all prerequisites:

```bash
#!/bin/bash
# Complete DrishtiKon Prerequisites Installation for Ubuntu

# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install -y curl wget git build-essential

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Java 21
sudo apt install -y openjdk-21-jdk
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc

# Install Docker
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo groupadd docker
sudo usermod -aG docker $USER

# Reload environment
source ~/.bashrc
newgrp docker

echo "✅ All prerequisites installed! Please logout and login again for Docker permissions."
echo "📋 Ready to clone DrishtiKon and run: ./scripts/setup.sh"
```

**Save this as `install-prerequisites.sh` and run:**

```bash
chmod +x install-prerequisites.sh
./install-prerequisites.sh
```

## 📋 Installation Checklist

Before proceeding with development setup, ensure you have:

- [ ] **Ubuntu 20.04 LTS or higher**
- [ ] **Node.js 18.0.0+** (`node --version`)
- [ ] **Java 21** (`java -version`)
- [ ] **Docker 20.10+** (`docker --version`)
- [ ] **Docker Compose 2.0+** (`docker compose version`)
- [ ] **Git 2.25+** (`git --version`)
- [ ] **4GB RAM minimum** (8GB recommended)
- [ ] **10GB free disk space** minimum

**Verification Script:**

```bash
# Quick verification of all prerequisites
echo "Node.js: $(node --version 2>/dev/null || echo '❌ Not installed')"
echo "Java: $(java -version 2>&1 | head -n1 || echo '❌ Not installed')"
echo "Docker: $(docker --version 2>/dev/null || echo '❌ Not installed')"
echo "Docker Compose: $(docker compose version 2>/dev/null || echo '❌ Not installed')"
echo "Git: $(git --version 2>/dev/null || echo '❌ Not installed')"
echo "RAM: $(free -h | awk '/^Mem/ {print $2}')"
echo "Disk: $(df -h . | awk 'NR==2 {print $4}')"
```

## 🏗️ Architecture Overview

DrishtiKon follows a modern monorepo architecture with clear separation of concerns:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Spring Boot 3.2 with Java 21 and PostgreSQL
- **Shared**: Common TypeScript types and configurations

## 🛠️ Local Development Setup

### 1. Prerequisites Installation

#### Node.js & npm

```bash
# Install Node.js 18+ (recommended: use nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Java Development Kit 21

```bash
# On macOS with Homebrew
brew install openjdk@21

# On Ubuntu/Debian
sudo apt install openjdk-21-jdk

# Verify installation
java -version
```

#### Docker & Docker Compose

```bash
# Install Docker Desktop from https://docker.com/products/docker-desktop
# Or on Linux:
sudo apt install docker.io docker-compose
```

### 2. Repository Setup

```bash
# Clone repository
git clone <repository-url>
cd DrishtiKon

# Install all dependencies
npm install

# This installs dependencies for:
# - Root workspace
# - apps/web (Next.js)
# - packages/types
# - packages/ui
```

### 3. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up postgres -d

# Database will be available at localhost:5432
# Database: drishti_kon
# Username: drishti
# Password: password
```

#### Option B: Local PostgreSQL Installation

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create user and database
sudo -u postgres psql
CREATE USER drishti WITH PASSWORD 'password';
CREATE DATABASE drishti_kon OWNER drishti;
GRANT ALL PRIVILEGES ON DATABASE drishti_kon TO drishti;
```

### 4. Run Database Migrations

```bash
cd apps/api

# Run Flyway migrations
./mvnw flyway:migrate

# Verify migration status
./mvnw flyway:info
```

### 5. Start Development Servers

#### Option A: Start All Services

```bash
# From root directory
npm run dev

# This starts:
# - Next.js frontend on http://localhost:3000
# - Spring Boot API on http://localhost:8080
```

#### Option B: Start Services Individually

```bash
# Terminal 1: Start Backend API
cd apps/api
./mvnw spring-boot:run

# Terminal 2: Start Frontend
cd apps/web
npm run dev
```

## 🧪 Testing

### Backend Testing

```bash
cd apps/api

# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run tests with coverage
./mvnw test jacoco:report
```

### Frontend Testing

```bash
cd apps/web

# Run Jest tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (if configured)
npm run test:e2e
```

## 🏗️ Building for Production

### Build All Applications

```bash
# From root
npm run build

# This builds:
# - Next.js optimized bundle
# - Spring Boot JAR
# - All packages
```

### Build Individual Applications

```bash
# Build frontend only
cd apps/web
npm run build

# Build backend only
cd apps/api
./mvnw clean package
```

## 🐳 Docker Development

### Full Stack with Docker

```bash
# Start all services (DB, API, Web)
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Services

```bash
# Start only database
docker-compose up postgres -d

# Start API and dependencies
docker-compose up postgres api -d

# Rebuild and start specific service
docker-compose up --build web
```

## 📝 Code Style & Formatting

### Frontend (TypeScript/React)

```bash
cd apps/web

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format with Prettier
npm run format

# Type check
npm run type-check
```

### Backend (Java)

```bash
cd apps/api

# Check style with Checkstyle (if configured)
./mvnw checkstyle:check

# Format code with Spotless (if configured)
./mvnw spotless:apply
```

## 🔧 Environment Configuration

### Backend Environment Variables

Create `apps/api/src/main/resources/application-local.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/drishti_kon
    username: drishti
    password: password

  mail:
    username: your-development-email@gmail.com
    password: your-app-password

app:
  jwt:
    secret: dev-secret-key
```

### Frontend Environment Variables

Create `apps/web/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=DrishtiKon Dev
```

## 🚀 Deployment Process

### Development Deployment

```bash
# Build and test
npm run build
npm run test

# Create production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy locally for testing
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Production Deployment

See [DEPLOYMENT_SETUP.md](../DEPLOYMENT_SETUP.md) for GitHub Actions setup.

## 🔍 Debugging

### Backend Debugging

```bash
# Run with debug port
cd apps/api
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Connect IDE debugger to port 5005
```

### Frontend Debugging

```bash
# Run Next.js in debug mode
cd apps/web
NODE_OPTIONS='--inspect' npm run dev

# Open Chrome DevTools
# Go to chrome://inspect
# Click "Configure" and add localhost:9229
```

### Database Debugging

```bash
# Connect to PostgreSQL
docker exec -it drishti-kon-db psql -U drishti -d drishti_kon

# View logs
docker-compose logs postgres

# View current connections
SELECT * FROM pg_stat_activity;
```

## 📊 Monitoring & Observability

### Application Health

- Backend: http://localhost:8080/api/actuator/health
- Frontend: Built-in Next.js health checks

### Logs

```bash
# Backend logs
cd apps/api
tail -f logs/application.log

# Frontend logs
cd apps/web
npm run dev  # Console logs

# Docker logs
docker-compose logs -f api
docker-compose logs -f web
```

## 🤝 Contributing Workflow

### Branch Strategy

- `main` - Production ready code
- `develop` - Development integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Production hotfixes

### Development Process

1. **Create feature branch**

   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Make changes and test**

   ```bash
   npm run test
   npm run lint
   npm run build
   ```

3. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/new-feature-name
   # Create PR through GitHub UI
   ```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

## 🐛 Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port
lsof -i :8080
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Reset database
docker-compose down postgres
docker volume rm drishtiKon_postgres_data
docker-compose up postgres -d
```

### Build Issues

```bash
# Clean all caches
npm run clean

# Clear Docker caches
docker system prune -a

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working

```bash
# Restart development server
cd apps/web
npm run dev

# Check file watchers limit (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```
