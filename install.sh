#!/bin/bash

# ISP Management System Installation Script
# This script will install Docker, Docker Compose, Node.js, and set up the ISP system

set -e

echo "🚀 ISP Management System Installation Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_status "Detected Linux OS"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_status "Detected macOS"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Function to install Docker on Linux
install_docker_linux() {
    print_status "Installing Docker on Linux..."
    
    # Update package index
    sudo apt-get update
    
    # Install required packages
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg \
        lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up stable repository
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    print_success "Docker installed successfully"
}

# Function to install Docker on macOS
install_docker_macos() {
    print_status "Installing Docker on macOS..."
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_status "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install Docker Desktop
    brew install --cask docker
    
    print_success "Docker Desktop installed. Please start Docker Desktop manually."
    print_warning "You may need to restart your terminal or log out and back in."
}

# Function to install Docker Compose
install_docker_compose() {
    print_status "Installing Docker Compose..."
    
    # Download Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    # Make it executable
    sudo chmod +x /usr/local/bin/docker-compose
    
    print_success "Docker Compose installed successfully"
}

# Function to check if Docker is running
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        return 1
    fi
    
    if ! docker --version &> /dev/null; then
        return 1
    fi
    
    return 0
}

# Function to check if Docker Compose is installed
check_docker_compose() {
    print_status "Checking Docker Compose installation..."
    
    if ! command -v docker-compose &> /dev/null; then
        return 1
    fi
    
    return 0
}

# Function to check Node.js version
check_nodejs() {
    print_status "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_warning "Node.js not found. Installing Node.js..."
        if [[ "$OS" == "linux" ]]; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [[ "$OS" == "macos" ]]; then
            brew install node@18
        fi
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -lt 18 ]]; then
            print_warning "Node.js version $NODE_VERSION detected. Upgrading to Node.js 18..."
            if [[ "$OS" == "linux" ]]; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif [[ "$OS" == "macos" ]]; then
                brew install node@18
            fi
        else
            print_success "Node.js $(node --version) is installed"
        fi
    fi
}

# Function to initialize database with seed data
init_database() {
    print_status "Initializing database with seed data..."
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 45
    
    # Run database migrations and seed data
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/028_create_customer_services_and_payments.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/029_create_hr_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/030_create_payroll_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/031_create_comprehensive_vehicle_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/032_create_messaging_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/033_create_analytics_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/034_create_task_management_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/035_create_settings_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/036_create_comprehensive_logs_tables.sql || true
    docker-compose exec -T mysql mysql -u isp_user -pisp_password_2024 isp_system < scripts/037_create_backup_tables.sql || true
    
    print_success "Database initialized with seed data"
}

# Function to create necessary directories and files
setup_directories() {
    print_status "Setting up directories and configuration files..."
    
    # Create directories
    mkdir -p ssl
    mkdir -p radius-config
    mkdir -p logs
    
    # Create nginx configuration
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream isp_app {
        server isp_app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://isp_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOF

    # Create environment file
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=mysql://isp_user:isp_password_2024@mysql:3306/isp_system
POSTGRES_HOST=mysql
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
DB_PORT=3306

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# MySQL Root Password
MYSQL_ROOT_PASSWORD=isp_root_password_2024
EOF

    print_success "Configuration files created"
}

# Function to start the ISP system
start_system() {
    print_status "Starting ISP Management System..."
    
    # Build and start containers
    docker-compose up -d --build
    
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "ISP Management System started successfully!"
        echo ""
        echo "🎉 Installation Complete!"
        echo "========================"
        echo ""
        echo "Access your ISP Management System at:"
        echo "🌐 Web Interface: http://localhost:3000"
        echo "🗄️  Database: localhost:3306"
        echo "🔐 RADIUS Server: localhost:1812 (Auth), localhost:1813 (Accounting)"
        echo "🔒 OpenVPN Server: localhost:1194"
        echo ""
        echo "Default Database Credentials:"
        echo "Username: isp_user"
        echo "Password: isp_password_2024"
        echo "Database: isp_system"
        echo ""
        echo "⚠️  IMPORTANT: Change default passwords in production!"
        echo ""
        echo "To stop the system: docker-compose down"
        echo "To view logs: docker-compose logs -f"
        echo "To restart: docker-compose restart"
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Main installation process
main() {
    print_status "Starting ISP Management System installation..."
    
    # Check Node.js version
    check_nodejs
    
    # Check if Docker is already installed
    if ! check_docker; then
        print_status "Docker not found. Installing Docker..."
        if [[ "$OS" == "linux" ]]; then
            install_docker_linux
        elif [[ "$OS" == "macos" ]]; then
            install_docker_macos
        fi
    else
        print_success "Docker is already installed"
    fi
    
    # Check if Docker Compose is already installed
    if ! check_docker_compose; then
        print_status "Docker Compose not found. Installing Docker Compose..."
        install_docker_compose
    else
        print_success "Docker Compose is already installed"
    fi
    
    # Setup directories and configuration
    setup_directories
    
    # Start the system
    start_system
    
    # Initialize database
    init_database
}

# Run main function
main "$@"
