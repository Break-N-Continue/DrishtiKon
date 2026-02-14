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

### Prerequisites

- **Node.js 18+**
- **Java 21**
- **Docker & Docker Compose**
- **PostgreSQL 15+** (or use Docker)

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
