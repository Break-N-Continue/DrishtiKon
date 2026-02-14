# DrishtiKon - College Community Platform

DrishtiKon is a college community platform that allows students to post queries, engage in discussions, and upvote useful content. Built as a monorepo with Next.js frontend and Spring Boot backend.

## 🏗️ Architecture

This is a **Turborepo** monorepo containing:

- **`apps/web`**: Next.js 14 frontend application
- **`apps/api`**: Spring Boot 3.2 backend API
- **`packages/types`**: Shared TypeScript types
- **`packages/ui`**: Shared UI components (future)
- **`packages/config`**: Shared configuration

## 🚀 Features (Version 0)

### Authentication

- ✅ College email-only registration (@aitpune.edu.in)
- ✅ OTP-based email verification
- ✅ JWT-based session management
- ✅ Role-based access (User/Admin)

### Posts

- ✅ Create text-only posts with title and description
- ✅ View all posts with pagination
- ✅ Delete posts (owner or admin only)

### Upvoting System

- ✅ One vote per user per post
- ✅ Toggle upvote/remove functionality
- ✅ Real-time upvote count display

### User Dashboard

- ✅ Personal post history
- ✅ Upvote activity tracking
- ✅ Basic profile information

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** + **Zod** for forms
- **Axios** for API calls

### Backend

- **Spring Boot 3.2** with Java 21
- **Spring Security** + **JWT** authentication
- **Spring Data JPA** for database operations
- **PostgreSQL** database
- **Flyway** for database migrations
- **Spring Mail** for OTP emails

### DevOps

- **Docker** & **Docker Compose** for containerization
- **Turbo** for monorepo build orchestration
- **GitHub Actions** for CI/CD

## 🏃 Getting Started

### Prerequisites & System Requirements

Before running DrishtiKon, you need to install the following tools on your Ubuntu system:

#### 1. Node.js 18+ Installation

**Option A: Using NodeSource Repository (Recommended)**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install curl if not installed
sudo apt install -y curl

# Add NodeSource repository for Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show npm version
```

**Option B: Using NVM (Node Version Manager)**

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version
```

#### 2. Java 21 Installation

```bash
# Update package list
sudo apt update

# Install OpenJDK 21
sudo apt install -y openjdk-21-jdk

# Set JAVA_HOME environment variable
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
source ~/.bashrc

# Verify installation
java -version   # Should show OpenJDK 21
javac -version  # Should show javac 21
```

**Alternative: Install using SDKMAN (Recommended for developers)**

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Java 21
sdk install java 21.0.1-tem
sdk use java 21.0.1-tem

# Verify installation
java -version
```

#### 3. Docker & Docker Compose Installation

```bash
# Remove old Docker versions
sudo apt remove docker docker-engine docker.io containerd runc

# Update package index
sudo apt update

# Install packages to allow apt to use a repository over HTTPS
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt update

# Install Docker Engine and Docker Compose
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to the docker group (to run docker without sudo)
sudo groupadd docker
sudo usermod -aG docker $USER

# Restart to apply group changes
# newgrp docker  # Or logout and login again

# Verify installation
docker --version
docker compose version
```

#### 4. PostgreSQL 15+ Installation (Optional - can use Docker)

```bash
# Update package list
sudo apt update

# Install PostgreSQL 15
sudo apt install -y postgresql-15 postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE USER drishti WITH PASSWORD 'password';
CREATE DATABASE drishti_kon OWNER drishti;
GRANT ALL PRIVILEGES ON DATABASE drishti_kon TO drishti;
\q
EOF

# Verify installation
sudo -u postgres psql -c "SELECT version();"
```

#### 5. Git Installation (if not already installed)

```bash
# Install Git
sudo apt install -y git

# Configure Git (replace with your details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify installation
git --version
```

#### 6. Additional Useful Tools

```bash
# Install build essentials and other useful tools
sudo apt install -y \
    build-essential \
    software-properties-common \
    apt-transport-https \
    wget \
    unzip \
    vim \
    htop

# Install Maven (alternative to using Maven wrapper)
sudo apt install -y maven

# Verify Maven installation
mvn --version
```

### System Requirements

**Minimum System Requirements:**

- **OS**: Ubuntu 20.04 LTS or higher
- **RAM**: 4GB (8GB recommended for development)
- **Storage**: 10GB free space
- **CPU**: 2 cores (4 cores recommended)

**Recommended for Development:**

- **RAM**: 8GB or more
- **Storage**: 20GB free space
- **CPU**: 4 cores or more
- **SSD**: For better performance

### Prerequisites Summary

- **Node.js 18+**
- **Java 21**
- **Docker & Docker Compose**
- **PostgreSQL 15+** (or use Docker)

### 🚀 One-Command Ubuntu Setup

For Ubuntu users, we provide an automated installation script:

```bash
# Download and run the Ubuntu prerequisites installer
curl -fsSL https://raw.githubusercontent.com/your-repo/DrishtiKon/main/scripts/install-ubuntu-prerequisites.sh | bash

# Or clone first and run locally
git clone <repository-url>
cd DrishtiKon
./scripts/install-ubuntu-prerequisites.sh
```

This script will automatically install:

- ✅ Node.js 18+ with npm
- ✅ Java 21 with proper JAVA_HOME
- ✅ Docker & Docker Compose with user permissions
- ✅ Git and development tools
- ✅ Optional PostgreSQL 15

**After the script completes:**

1. Logout and login again (for Docker permissions)
2. Run `./scripts/setup.sh` to set up the project

### Quick Start with Docker

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd DrishtiKon
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432

### Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start PostgreSQL**

   ```bash
   docker-compose up postgres -d
   ```

3. **Run database migrations**

   ```bash
   cd apps/api
   ./mvnw flyway:migrate
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
DrishtiKon/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # App router pages
│   │   │   ├── components/   # React components
│   │   │   ├── lib/          # Utilities
│   │   │   └── types/        # App-specific types
│   │   ├── public/           # Static assets
│   │   └── package.json
│   └── api/                  # Spring Boot backend
│       ├── src/main/java/com/drishti/kon/
│       │   ├── controller/   # REST controllers
│       │   ├── service/      # Business logic
│       │   ├── repository/   # Data access layer
│       │   ├── entity/       # JPA entities
│       │   ├── dto/          # Data transfer objects
│       │   ├── config/       # Configuration
│       │   └── security/     # Security configuration
│       ├── src/main/resources/
│       │   ├── application.yml
│       │   └── db/migration/ # Flyway migrations
│       └── pom.xml
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # Shared UI components
│   └── config/               # Shared configuration
├── docker/                   # Docker configuration
├── docs/                     # Documentation
├── scripts/                  # Build & deployment scripts
├── docker-compose.yml
├── turbo.json
└── package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (Spring Boot)

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/drishti_kon
DATABASE_USERNAME=drishti
DATABASE_PASSWORD=password

# JWT
JWT_SECRET=your-jwt-secret-key

# Email (Gmail SMTP)
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

#### Frontend (Next.js)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Database Setup

The application uses PostgreSQL with Flyway migrations. The database schema includes:

- **users**: User accounts with email domain validation
- **posts**: Text posts with title and description
- **upvotes**: Vote tracking with constraints
- **otp_verification**: Email verification system

## 🚢 Deployment

### Manual GitHub Actions Deployment

1. **Configure GitHub Secrets** (see [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md))
2. **Go to Actions tab** in GitHub
3. **Select "Docker Build -> Push -> Deploy"**
4. **Click "Run workflow"**
5. **Choose environment and run**

### Production Docker Build

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Backend tests only
cd apps/api && ./mvnw test

# Frontend tests only
cd apps/web && npm run test
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/refresh` - Refresh JWT token

### Posts Endpoints

- `GET /api/posts` - List posts (with pagination)
- `POST /api/posts` - Create new post
- `GET /api/posts/{id}` - Get post by ID
- `PUT /api/posts/{id}` - Update post (owner only)
- `DELETE /api/posts/{id}` - Delete post (owner/admin)

### Upvotes Endpoints

- `POST /api/posts/{id}/upvote` - Toggle upvote on post
- `GET /api/users/me/upvotes` - Get user's upvotes

### User Endpoints

- `GET /api/users/me` - Get current user profile
- `GET /api/users/me/dashboard` - Get dashboard stats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔮 Roadmap

### Version 1.0

- [ ] File attachments in posts
- [ ] Comments on posts
- [ ] Real-time notifications
- [ ] Advanced search and filtering
- [ ] User reputation system

### Version 2.0

- [ ] Categories/tags for posts
- [ ] Private messaging
- [ ] Mobile app
- [ ] Analytics dashboard (admin)

---

**Made with ❤️ for AIT Pune College Community**
