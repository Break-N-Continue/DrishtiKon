#!/bin/bash

# DrishtiKon Ubuntu Prerequisites Installation Script
# This script installs all required tools to run DrishtiKon on Ubuntu

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Check if running on Ubuntu
check_ubuntu() {
    if [[ $(uname -s) != "Linux" ]] || [[ ! -f /etc/lsb-release ]]; then
        print_error "This script is designed for Ubuntu Linux only."
        exit 1
    fi
    
    UBUNTU_VERSION=$(lsb_release -rs)
    print_info "Detected Ubuntu $UBUNTU_VERSION"
    
    if [[ $(echo "$UBUNTU_VERSION >= 20.04" | bc -l) -eq 0 ]]; then
        print_warning "Ubuntu 20.04+ is recommended. Current version: $UBUNTU_VERSION"
        read -p "Continue anyway? [y/N] " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Update system packages
update_system() {
    print_header "📦 Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y curl wget git build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    print_status "System updated successfully"
}

# Install Node.js 18+
install_nodejs() {
    print_header "📦 Installing Node.js 18..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v\([0-9]*\).*/\1/')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_status "Node.js is already installed: $NODE_VERSION"
            return 0
        else
            print_warning "Upgrading Node.js from $NODE_VERSION to 18+"
        fi
    fi
    
    # Add NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Verify installation
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        print_status "Node.js installed successfully: $NODE_VERSION"
        print_status "npm installed successfully: $NPM_VERSION"
    else
        print_error "Node.js installation failed"
        exit 1
    fi
}

# Install Java 21
install_java() {
    print_header "☕ Installing Java 21..."
    
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        if echo "$JAVA_VERSION" | grep -q "21\|22\|23"; then
            print_status "Java 21+ is already installed: $JAVA_VERSION"
            return 0
        else
            print_warning "Different Java version detected: $JAVA_VERSION"
            print_info "Installing Java 21 alongside existing installation"
        fi
    fi
    
    # Install OpenJDK 21
    sudo apt install -y openjdk-21-jdk
    
    # Set JAVA_HOME
    JAVA_HOME_PATH="/usr/lib/jvm/java-21-openjdk-amd64"
    if [ ! -d "$JAVA_HOME_PATH" ]; then
        JAVA_HOME_PATH="/usr/lib/jvm/java-21-openjdk"
    fi
    
    if [ -d "$JAVA_HOME_PATH" ]; then
        echo "export JAVA_HOME=$JAVA_HOME_PATH" >> ~/.bashrc
        echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc
        export JAVA_HOME="$JAVA_HOME_PATH"
        export PATH="$PATH:$JAVA_HOME/bin"
        print_status "JAVA_HOME set to: $JAVA_HOME_PATH"
    fi
    
    # Verify installation
    if command -v java &> /dev/null && command -v javac &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n 1)
        print_status "Java installed successfully: $JAVA_VERSION"
    else
        print_error "Java installation failed"
        exit 1
    fi
}

# Install Docker and Docker Compose
install_docker() {
    print_header "🐳 Installing Docker and Docker Compose..."
    
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker is already installed: $DOCKER_VERSION"
        
        # Check if user is in docker group
        if groups $USER | grep -q docker; then
            print_status "User is already in docker group"
            return 0
        else
            print_info "Adding user to docker group..."
            sudo usermod -aG docker $USER
            print_status "User added to docker group"
            return 0
        fi
    fi
    
    # Remove old versions
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
    
    # Add Docker's official GPG key
    sudo mkdir -m 0755 -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up the repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Add user to docker group
    sudo groupadd docker 2>/dev/null || true
    sudo usermod -aG docker $USER
    
    # Start Docker service
    sudo systemctl enable docker
    sudo systemctl start docker
    
    # Verify installation
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker installed successfully: $DOCKER_VERSION"
        
        if docker compose version &> /dev/null; then
            COMPOSE_VERSION=$(docker compose version)
            print_status "Docker Compose installed successfully: $COMPOSE_VERSION"
        fi
    else
        print_error "Docker installation failed"
        exit 1
    fi
}

# Install PostgreSQL (optional)
install_postgresql() {
    print_header "🗄️ Installing PostgreSQL 15 (optional)..."
    
    read -p "Do you want to install PostgreSQL locally? (Docker is recommended) [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Skipping PostgreSQL installation. You can use Docker instead."
        return 0
    fi
    
    if command -v psql &> /dev/null; then
        PG_VERSION=$(psql --version | head -n 1)
        print_status "PostgreSQL is already installed: $PG_VERSION"
        return 0
    fi
    
    # Install PostgreSQL
    sudo apt install -y postgresql-15 postgresql-contrib
    
    # Start and enable PostgreSQL
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database and user
    sudo -u postgres psql << EOF
CREATE USER drishti WITH PASSWORD 'password';
CREATE DATABASE drishti_kon OWNER drishti;
GRANT ALL PRIVILEGES ON DATABASE drishti_kon TO drishti;
\\q
EOF
    
    print_status "PostgreSQL installed and configured"
    print_info "Database: drishti_kon"
    print_info "User: drishti"
    print_info "Password: password"
}

# Install additional development tools
install_dev_tools() {
    print_header "🛠️ Installing additional development tools..."
    
    # Install useful tools
    sudo apt install -y \
        vim \
        nano \
        htop \
        tree \
        jq \
        unzip \
        zip \
        maven \
        bash-completion
        
    print_status "Development tools installed"
}

# System requirements check
check_system_requirements() {
    print_header "💻 Checking system requirements..."
    
    # Check RAM
    RAM_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ $RAM_GB -ge 8 ]; then
        print_status "RAM: ${RAM_GB}GB (Recommended: 8GB+) ✓"
    elif [ $RAM_GB -ge 4 ]; then
        print_warning "RAM: ${RAM_GB}GB (Minimum: 4GB) - Consider upgrading for better performance"
    else
        print_error "RAM: ${RAM_GB}GB - Insufficient RAM (minimum 4GB required)"
    fi
    
    # Check disk space
    DISK_GB=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ $DISK_GB -ge 20 ]; then
        print_status "Disk space: ${DISK_GB}GB available (Recommended: 20GB+) ✓"
    elif [ $DISK_GB -ge 10 ]; then
        print_warning "Disk space: ${DISK_GB}GB available (Minimum: 10GB)"
    else
        print_error "Disk space: ${DISK_GB}GB - Insufficient disk space (minimum 10GB required)"
    fi
    
    # Check CPU cores
    CPU_CORES=$(nproc)
    if [ $CPU_CORES -ge 4 ]; then
        print_status "CPU: ${CPU_CORES} cores (Recommended: 4+) ✓"
    elif [ $CPU_CORES -ge 2 ]; then
        print_warning "CPU: ${CPU_CORES} cores (Minimum: 2)"
    else
        print_error "CPU: ${CPU_CORES} cores - Performance may be limited"
    fi
}

# Final verification
verify_installation() {
    print_header "✅ Verifying installation..."
    
    echo ""
    echo "📋 Installation Summary:"
    echo "Node.js: $(node --version 2>/dev/null || echo '❌ Not found')"
    echo "npm: $(npm --version 2>/dev/null || echo '❌ Not found')"
    echo "Java: $(java -version 2>&1 | head -n1 | cut -d'"' -f2 2>/dev/null || echo '❌ Not found')"
    echo "Docker: $(docker --version 2>/dev/null | cut -d' ' -f3 | sed 's/,//' || echo '❌ Not found')"
    echo "Docker Compose: $(docker compose version 2>/dev/null | grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' || echo '❌ Not found')"
    echo "Git: $(git --version 2>/dev/null | cut -d' ' -f3 || echo '❌ Not found')"
    
    if command -v psql &> /dev/null; then
        echo "PostgreSQL: $(psql --version 2>/dev/null | head -n 1 | cut -d' ' -f3 || echo '❌ Not found')"
    fi
    
    echo ""
}

# Final instructions
final_instructions() {
    print_header "🎉 Installation Complete!"
    echo ""
    echo "⚠️  IMPORTANT: You must logout and login again (or restart) for Docker permissions to take effect."
    echo ""
    echo "🚀 Next steps:"
    echo "1. Logout and login again (or run: newgrp docker)"
    echo "2. Clone DrishtiKon repository:"
    echo "   git clone <repository-url>"
    echo "   cd DrishtiKon"
    echo ""
    echo "3. Run the setup script:"
    echo "   ./scripts/setup.sh"
    echo ""
    echo "4. Or start manually:"
    echo "   npm install"
    echo "   docker-compose up postgres -d"
    echo "   cd apps/api && ./mvnw flyway:migrate"
    echo "   npm run dev"
    echo ""
    echo "📚 Documentation:"
    echo "- README.md - Project overview"
    echo "- docs/DEVELOPMENT.md - Development guide"
    echo "- docs/API.md - API documentation"
    echo ""
    print_status "Ready for DrishtiKon development! 🎯"
}

# Main execution
main() {
    echo "=================================================================================="
    echo "🚀 DrishtiKon Ubuntu Prerequisites Installation Script"
    echo "=================================================================================="
    echo ""
    echo "This script will install all required tools for DrishtiKon development:"
    echo "- Node.js 18+"
    echo "- Java 21"  
    echo "- Docker & Docker Compose"
    echo "- Additional development tools"
    echo ""
    
    check_ubuntu
    check_system_requirements
    
    echo ""
    read -p "Do you want to proceed with the installation? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        echo "Installation cancelled."
        exit 0
    fi
    
    echo ""
    update_system
    install_nodejs
    install_java
    install_docker
    install_postgresql
    install_dev_tools
    verify_installation
    final_instructions
}

# Run main function
main "$@"