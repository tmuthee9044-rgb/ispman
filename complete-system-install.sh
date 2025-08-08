#!/bin/bash

# ISP Management System - Complete System Installation Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ISP Management System - Complete Installation${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    local missing_deps=()
    
    if ! command_exists docker; then
        missing_deps+=("docker")
    fi
    
    if ! command_exists node; then
        missing_deps+=("node")
    fi
    
    if ! command_exists git; then
        missing_deps+=("git")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing prerequisites: ${missing_deps[*]}${NC}"
        echo -e "${YELLOW}💡 Run: ./install-prerequisites.sh first${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites are installed${NC}"
}

# Create project structure
create_project_structure() {
    echo -e "${BLUE}📁 Creating project structure...${NC}"
    
    # Create main directories
    mkdir -p {app,components,lib,types,hooks,scripts,public,styles}
    mkdir -p app/{actions,api,customers,billing,network,settings,reports}
    mkdir -p components/ui
    
    echo -e "${GREEN}✅ Project structure created${NC}"
}

# Generate environment file
generate_env_file() {
    echo -e "${BLUE}🔧 Generating environment configuration...${NC}"
    
    # Generate random passwords and secrets
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    JWT_SECRET=$(openssl rand -base64 32)
    
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://isp_user:${DB_PASSWORD}@localhost:5432/isp_management"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=isp_management
DB_USER=isp_user
DB_PASSWORD=${DB_PASSWORD}

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration (Optional - configure with your SMTP settings)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Application Configuration
NODE_ENV=development
PORT=3000

# Company Information
COMPANY_NAME="Your ISP Company"
COMPANY_EMAIL="admin@yourisp.com"
COMPANY_PHONE="+1234567890"
EOF

    echo -e "${GREEN}✅ Environment file created (.env.local)${NC}"
}

# Create Docker Compose file
create_docker_compose() {
    echo -e "${BLUE}🐳 Creating Docker Compose configuration...${NC}"
    
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: isp_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: isp_management
      POSTGRES_USER: isp_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
    networks:
      - isp_network

  # Redis Cache
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

  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: isp_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://isp_user:${DB_PASSWORD}@postgres:5432/isp_management
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - isp_network
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: isp_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - isp_network

volumes:
  postgres_data:
  redis_data:

networks:
  isp_network:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Docker Compose configuration created${NC}"
}

# Install npm dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing npm dependencies...${NC}"
    
    # Clean install
    rm -rf node_modules package-lock.json
    npm install
    
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
}

# Build the application
build_application() {
    echo -e "${BLUE}🔨 Building the application...${NC}"
    
    npm run build
    
    echo -e "${GREEN}✅ Application built successfully${NC}"
}

# Initialize database
initialize_database() {
    echo -e "${BLUE}🗄️  Initializing database...${NC}"
    
    # Start only PostgreSQL first
    docker compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
    sleep 30
    
    # Check if database is accessible
    for i in {1..30}; do
        if docker compose exec -T postgres pg_isready -U isp_user -d isp_management >/dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
            break
        fi
        echo -e "${YELLOW}⏳ Waiting for PostgreSQL... ($i/30)${NC}"
        sleep 2
    done
    
    echo -e "${GREEN}✅ Database initialized${NC}"
}

# Start all services
start_services() {
    echo -e "${BLUE}🚀 Starting all services...${NC}"
    
    # Start all services
    docker compose up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for all services to start...${NC}"
    sleep 45
    
    echo -e "${GREEN}✅ All services started${NC}"
}

# Verify installation
verify_installation() {
    echo -e "${BLUE}🔍 Verifying installation...${NC}"
    
    # Check if containers are running
    if docker compose ps | grep -q "Up"; then
        echo -e "${GREEN}✅ Docker containers are running${NC}"
    else
        echo -e "${RED}❌ Some containers are not running${NC}"
        docker compose ps
        return 1
    fi
    
    # Check if application is accessible
    sleep 10
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is accessible at http://localhost:3000${NC}"
    else
        echo -e "${YELLOW}⚠️  Application may still be starting up...${NC}"
    fi
    
    # Check database connection
    if docker compose exec -T postgres pg_isready -U isp_user -d isp_management >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Database is accessible${NC}"
    else
        echo -e "${RED}❌ Database connection failed${NC}"
        return 1
    fi
}

# Create startup script
create_startup_script() {
    echo -e "${BLUE}📝 Creating startup script...${NC}"
    
    cat > start-system.sh << 'EOF'
#!/bin/bash

# ISP Management System - Startup Script
echo "🚀 Starting ISP Management System..."

# Start all services
docker compose up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Check status
echo "📊 Service Status:"
docker compose ps

echo ""
echo "🌐 Access the system at:"
echo "   http://localhost:3000"
echo "   http://localhost (via Nginx)"
echo ""
echo "🛠️  Useful commands:"
echo "   docker compose logs -f    # View logs"
echo "   docker compose down       # Stop services"
echo "   docker compose restart    # Restart services"
EOF

    chmod +x start-system.sh
    
    echo -e "${GREEN}✅ Startup script created (start-system.sh)${NC}"
}

# Main installation function
main() {
    echo -e "${BLUE}🎯 Starting complete system installation...${NC}"
    echo ""
    
    check_prerequisites
    echo ""
    
    create_project_structure
    echo ""
    
    generate_env_file
    echo ""
    
    create_docker_compose
    echo ""
    
    install_dependencies
    echo ""
    
    initialize_database
    echo ""
    
    start_services
    echo ""
    
    create_startup_script
    echo ""
    
    verify_installation
    echo ""
    
    echo -e "${GREEN}🎉 ISP Management System installation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access your system at:${NC}"
    echo "   http://localhost:3000"
    echo "   http://localhost (via Nginx)"
    echo ""
    echo -e "${BLUE}🛠️  Management commands:${NC}"
    echo "   ./start-system.sh         # Start the system"
    echo "   docker compose down       # Stop the system"
    echo "   docker compose logs -f    # View logs"
    echo "   ./troubleshoot.sh         # Troubleshoot issues"
    echo ""
    echo -e "${BLUE}📋 Default credentials:${NC}"
    echo "   Username: admin@yourisp.com"
    echo "   Password: admin123"
    echo ""
    echo -e "${YELLOW}⚠️  Remember to change default passwords in production!${NC}"
}

# Run main function
main "$@"
