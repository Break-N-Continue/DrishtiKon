#!/bin/bash

# DrishtiKon Setup Script
# This script helps set up the development environment

set -e  # Exit on any error

echo "🚀 Setting up DrishtiKon development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    echo "Checking requirements..."
    local missing_tools=""
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_status "Node.js is installed: $NODE_VERSION"
        else
            print_error "Node.js version is too old: $NODE_VERSION (required: 18+)"
            missing_tools="${missing_tools}nodejs "
        fi
    else
        print_error "Node.js is not installed"
        missing_tools="${missing_tools}nodejs "
    fi
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        if echo "$JAVA_VERSION" | grep -q "21\|22\|23"; then
            print_status "Java is installed: $JAVA_VERSION"
        else
            print_warning "Java version might be incompatible. Java 21 is recommended."
            print_info "Current version: $JAVA_VERSION"
        fi
    else
        print_error "Java is not installed"
        missing_tools="${missing_tools}java "
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker is installed: $DOCKER_VERSION"
        
        # Check if user can run docker without sudo
        if docker ps &> /dev/null; then
            print_status "Docker permissions are correctly configured"
        else
            print_warning "Docker requires sudo. Add your user to docker group:"
            echo "  sudo usermod -aG docker \$USER"
            echo "  Then logout and login again"
        fi
    else
        print_error "Docker is not installed"
        missing_tools="${missing_tools}docker "
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        if command -v docker-compose &> /dev/null; then
            COMPOSE_VERSION=$(docker-compose --version)
        else
            COMPOSE_VERSION=$(docker compose version)
        fi
        print_status "Docker Compose is available: $COMPOSE_VERSION"
    else
        print_error "Docker Compose is not available"
        missing_tools="${missing_tools}docker-compose "
    fi
    
    # If any tools are missing, provide installation instructions
    if [ -n "$missing_tools" ]; then
        echo ""
        print_error "Missing required tools: $missing_tools"
        echo ""
        echo "🔧 Ubuntu Installation Instructions:"
        echo ""
        
        if [[ $missing_tools == *"nodejs"* ]]; then
            echo "📦 Install Node.js 18+:"
            echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
            echo "  sudo apt install -y nodejs"
            echo ""
        fi
        
        if [[ $missing_tools == *"java"* ]]; then
            echo "☕ Install Java 21:"
            echo "  sudo apt update"
            echo "  sudo apt install -y openjdk-21-jdk"
            echo ""
        fi
        
        if [[ $missing_tools == *"docker"* ]]; then
            echo "🐳 Install Docker & Docker Compose:"
            echo "  # Update packages"
            echo "  sudo apt update"
            echo "  sudo apt install -y ca-certificates curl gnupg lsb-release"
            echo ""  
            echo "  # Add Docker GPG key"
            echo "  sudo mkdir -m 0755 -p /etc/apt/keyrings"
            echo "  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg"
            echo ""
            echo "  # Add repository"
            echo '  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null'
            echo ""
            echo "  # Install Docker"
            echo "  sudo apt update"
            echo "  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
            echo ""
            echo "  # Add user to docker group"
            echo "  sudo groupadd docker"
            echo "  sudo usermod -aG docker \$USER"
            echo "  newgrp docker"
            echo ""
        fi
        
        echo "After installing missing tools, run this script again."
        exit 1
    fi
}

# Install npm dependencies
install_dependencies() {
    echo ""
    echo "📦 Installing dependencies..."
    
    if npm install; then
        print_status "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Setup database
setup_database() {
    echo ""
    echo "🗄️ Setting up database..."
    
    if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
        print_info "Starting PostgreSQL with Docker..."
        if docker-compose up postgres -d; then
            print_status "PostgreSQL started successfully"
            
            # Wait for database to be ready
            echo "Waiting for database to be ready..."
            sleep 10
            
            # Run migrations
            print_info "Running database migrations..."
            cd apps/api
            if ./mvnw flyway:migrate; then
                print_status "Database migrations completed"
            else
                print_error "Database migrations failed"
                exit 1
            fi
            cd ../..
        else
            print_error "Failed to start PostgreSQL"
            exit 1
        fi
    else
        print_warning "Docker not available. Please set up PostgreSQL manually:"
        echo "1. Install PostgreSQL 15+"
        echo "2. Create database 'drishti_kon'"
        echo "3. Create user 'drishti' with password 'password'"
        echo "4. Run: cd apps/api && ./mvnw flyway:migrate"
    fi
}

# Create environment files
create_env_files() {
    echo ""
    echo "⚙️ Creating environment files..."
    
    # Backend environment
    if [ ! -f "apps/api/src/main/resources/application-local.yml" ]; then
        cat > apps/api/src/main/resources/application-local.yml << EOF
spring:
  profiles:
    active: local
  datasource:
    url: jdbc:postgresql://localhost:5432/drishti_kon
    username: drishti
    password: password
  mail:
    username: your-email@gmail.com
    password: your-app-password
security:
  jwt:
    secret: development-secret-key-change-in-production
EOF
        print_status "Created backend environment file"
    else
        print_warning "Backend environment file already exists"
    fi
    
    # Frontend environment  
    if [ ! -f "apps/web/.env.local" ]; then
        cat > apps/web/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=DrishtiKon Development
EOF
        print_status "Created frontend environment file"
    else
        print_warning "Frontend environment file already exists"
    fi
}

# Build applications
build_apps() {
    echo ""
    echo "🔨 Building applications..."
    
    if npm run build; then
        print_status "Applications built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Start development servers
start_dev_servers() {
    echo ""
    print_info "🎯 Setup completed successfully!"
    echo ""
    echo "To start development servers:"
    echo "  npm run dev                    # Start all services"
    echo "  cd apps/web && npm run dev     # Start frontend only"
    echo "  cd apps/api && ./mvnw spring-boot:run  # Start backend only"
    echo ""
    echo "URLs:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend:  http://localhost:8080/api"
    echo "  Database: localhost:5432"
    echo ""
    echo "Next steps:"
    echo "1. Update email configuration in apps/api/src/main/resources/application-local.yml"
    echo "2. Set up Gmail app password for OTP emails"
    echo "3. Run 'npm run dev' to start development"
    echo ""
    
    read -p "Do you want to start the development servers now? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Starting development servers..."
        npm run dev
    fi
}

# Main execution
main() {
    echo "Welcome to DrishtiKon Setup!"
    echo "This script will set up your development environment."
    echo ""
    
    check_requirements
    install_dependencies
    setup_database
    create_env_files
    build_apps
    start_dev_servers
}

# Run main function
main "$@"