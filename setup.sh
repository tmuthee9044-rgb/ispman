#!/bin/bash

# ISP Management System - Complete Setup Script
# This script provides the easiest possible installation experience

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

print_header "ISP Management System - One-Click Setup"
echo ""
print_info "This script will automatically install and configure everything you need:"
print_info "✓ Docker and Docker Compose"
print_info "✓ PostgreSQL database with complete schema"
print_info "✓ Next.js application with all features"
print_info "✓ Network monitoring tools"
print_info "✓ Sample data for immediate testing"
echo ""

# Ask for confirmation
read -p "Do you want to continue with the installation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Installation cancelled by user"
    exit 0
fi

# Detect OS
print_step "Detecting operating system..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_success "Detected Linux OS"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_success "Detected macOS"
else
    print_error "Unsupported operating system: $OSTYPE"
    print_info "This script supports Linux and macOS only"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Docker on Linux
install_docker_linux() {
    print_step "Installing Docker on Linux..."
    
    # Update package index
    sudo apt-get update -qq
    
    # Install required packages
    sudo apt-get install -y -qq \
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
    sudo apt-get update -qq
    sudo apt-get install -y -qq docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    print_success "Docker installed successfully"
}

# Function to install Docker on macOS
install_docker_macos() {
    print_step "Installing Docker on macOS..."
    
    # Check if Homebrew is installed
    if ! command_exists brew; then
        print_step "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install Docker Desktop
    brew install --cask docker
    
    print_success "Docker Desktop installed"
    print_warning "Please start Docker Desktop manually and wait for it to be ready"
    
    # Wait for Docker Desktop to start
    print_step "Waiting for Docker Desktop to start..."
    while ! docker info >/dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo ""
    print_success "Docker Desktop is ready"
}

# Check and install Docker
if ! command_exists docker; then
    if [[ "$OS" == "linux" ]]; then
        install_docker_linux
    elif [[ "$OS" == "macos" ]]; then
        install_docker_macos
    fi
else
    print_success "Docker is already installed"
fi

# Check Docker Compose
if ! docker compose version >/dev/null 2>&1; then
    if ! command_exists docker-compose; then
        print_error "Docker Compose not found. Please install Docker Compose manually."
        exit 1
    else
        print_warning "Using legacy docker-compose command"
        DOCKER_COMPOSE="docker-compose"
    fi
else
    DOCKER_COMPOSE="docker compose"
fi

print_success "Docker Compose is available"

# Create project directory structure
print_step "Setting up project structure..."
mkdir -p logs ssl backup

# Create environment file
print_step "Creating environment configuration..."
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
POSTGRES_HOST=postgres
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
POSTGRES_PORT=5432

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production-$(openssl rand -hex 32)
NEXTAUTH_URL=http://localhost:3000

# ISP Configuration
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+254700000000
DEFAULT_CURRENCY=KES
DEFAULT_TIMEZONE=Africa/Nairobi

# M-Pesa Configuration (Optional)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_mpesa_passkey

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EOF

print_success "Environment file created"

# Create Docker Compose file
print_step "Creating Docker Compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: isp_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: isp_system
      POSTGRES_USER: isp_user
      POSTGRES_PASSWORD: isp_password_2024
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
    networks:
      - isp_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U isp_user -d isp_system"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ISP Management Application
  isp_app:
    build: .
    container_name: isp_management
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
      - NEXTAUTH_SECRET=your-secret-key-here-change-this
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - isp_network
    volumes:
      - ./logs:/app/logs

  # Redis for caching and sessions
  redis:
    image: redis:7-alpine
    container_name: isp_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - isp_network
    command: redis-server --appendonly yes

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: isp_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - isp_app
    networks:
      - isp_network

volumes:
  postgres_data:
  redis_data:

networks:
  isp_network:
    driver: bridge
EOF

# Create Nginx configuration
print_step "Creating Nginx configuration..."
cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    upstream isp_app {
        server isp_app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        location / {
            proxy_pass http://isp_app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            proxy_read_timeout 86400;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

print_success "Nginx configuration created"

# Create a simple Dockerfile for the Next.js app
print_step "Creating application Dockerfile..."
cat > Dockerfile << 'EOF'
# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOF

print_success "Dockerfile created"

# Start the system
print_step "Starting ISP Management System..."
print_info "This may take a few minutes to download and build containers..."

# Build and start containers
$DOCKER_COMPOSE up -d --build

print_step "Waiting for services to start..."
sleep 10

# Wait for database to be ready
print_step "Waiting for database to initialize..."
while ! docker exec isp_postgres pg_isready -U isp_user -d isp_system >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo ""

# Run database setup
print_step "Setting up database schema and sample data..."
docker exec -i isp_postgres psql -U isp_user -d isp_system < scripts/007_run_all_scripts.sql

print_success "Database setup completed"

# Check if services are running
print_step "Verifying services..."
if docker ps | grep -q "isp_management.*Up"; then
    print_success "ISP Management application is running"
else
    print_error "ISP Management application failed to start"
    print_info "Check logs with: $DOCKER_COMPOSE logs isp_app"
fi

if docker ps | grep -q "isp_postgres.*Up"; then
    print_success "PostgreSQL database is running"
else
    print_error "PostgreSQL database failed to start"
    print_info "Check logs with: $DOCKER_COMPOSE logs postgres"
fi

# Final success message
print_header "🎉 Installation Complete!"
echo ""
print_success "Your ISP Management System is now running!"
echo ""
print_info "Access your system:"
echo "🌐 Web Interface: http://localhost:3000"
echo "🗄️  Database: localhost:5432"
echo "📊 Admin Panel: http://localhost:3000/admin"
echo ""
print_info "Default Database Credentials:"
echo "Username: isp_user"
echo "Password: isp_password_2024"
echo "Database: isp_system"
echo ""
print_info "Sample Data Included:"
echo "• 8 customers with various service plans"
echo "• 8 service plans from basic to enterprise"
echo "• Network routers and equipment inventory"
echo "• Payment history and invoices"
echo "• Support tickets and system logs"
echo ""
print_warning "⚠️  IMPORTANT SECURITY NOTES:"
echo "• Change default passwords in production!"
echo "• Update NEXTAUTH_SECRET in .env file"
echo "• Configure SSL certificates for HTTPS"
echo "• Set up proper firewall rules"
echo ""
print_info "Useful Commands:"
echo "• Stop system: $DOCKER_COMPOSE down"
echo "• View logs: $DOCKER_COMPOSE logs -f"
echo "• Restart: $DOCKER_COMPOSE restart"
echo "• Update: $DOCKER_COMPOSE pull && $DOCKER_COMPOSE up -d"
echo ""
print_info "For support and documentation, check the README.md file"
print_success "Happy managing! 🚀"
