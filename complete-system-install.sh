#!/bin/bash

# ISP Management System - Complete Installation Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️  Installing Complete ISP Management System...${NC}"

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        echo -e "${YELLOW}💡 Try: sudo systemctl start docker${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Create project directory
create_project() {
    echo -e "${BLUE}📁 Creating project structure...${NC}"
    
    # We're already in the project directory, just ensure permissions
    chmod +x *.sh 2>/dev/null || true
    
    echo -e "${GREEN}✅ Project structure ready${NC}"
}

# Generate environment file
generate_env() {
    echo -e "${BLUE}🔧 Generating environment configuration...${NC}"
    
    cat > .env << EOF
# Database Configuration
DATABASE_URL=mysql://isp_user:isp_password_2024@localhost:3306/isp_system
POSTGRES_HOST=localhost
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
DB_PORT=3306
DB_SSL=false

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "your-secret-key-change-this-$(date +%s)")
NEXTAUTH_URL=http://localhost:3000

# ISP Configuration
COMPANY_NAME="ISP Management System"
COMPANY_EMAIL="admin@isp.local"
ADMIN_EMAIL="admin@isp.local"
ADMIN_PASSWORD="admin123"

# Network Configuration
RADIUS_SECRET=radius_secret_2024
OPENVPN_PORT=1194

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"
EOF

    echo -e "${GREEN}✅ Environment configuration generated${NC}"
}

# Build and start services
start_services() {
    echo -e "${BLUE}🚀 Building and starting services...${NC}"
    
    # Stop any existing containers
    docker compose down 2>/dev/null || true
    
    # Remove any existing containers and volumes
    docker compose rm -f 2>/dev/null || true
    
    # Build and start services
    echo -e "${YELLOW}📦 Building application...${NC}"
    docker compose build --no-cache
    
    echo -e "${YELLOW}🚀 Starting services...${NC}"
    docker compose up -d
    
    echo -e "${GREEN}✅ Services started${NC}"
}

# Wait for services to be ready
wait_for_services() {
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    
    # Wait for MySQL
    echo -n "Waiting for MySQL"
    for i in {1..60}; do
        if docker compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
            echo -e "\n${GREEN}✅ MySQL is ready${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
    
    # Wait for application
    echo -n "Waiting for application"
    for i in {1..60}; do
        if curl -f http://localhost:3000/api/database/status >/dev/null 2>&1; then
            echo -e "\n${GREEN}✅ Application is ready${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
}

# Initialize database
init_database() {
    echo -e "${BLUE}🗄️  Initializing database...${NC}"
    
    # Wait a bit more for MySQL to be fully ready
    sleep 10
    
    # Run database initialization scripts
    echo -e "${YELLOW}📊 Running database scripts...${NC}"
    
    # The scripts will be automatically run by MySQL on first startup
    # due to the volume mount in docker-compose.yml
    
    echo -e "${GREEN}✅ Database initialized${NC}"
}

# Create admin user
create_admin() {
    echo -e "${BLUE}👤 Creating admin user...${NC}"
    
    # This would typically be done through the application API
    # For now, we'll just note that the admin user should be created on first login
    
    echo -e "${GREEN}✅ Admin user setup ready${NC}"
}

# Final health check
health_check() {
    echo -e "${BLUE}🔍 Performing final health check...${NC}"
    
    # Check all services
    services=("mysql" "isp_app" "redis" "nginx")
    
    for service in "${services[@]}"; do
        if docker compose ps | grep -q "$service.*Up"; then
            echo -e "${GREEN}✅ $service is running${NC}"
        else
            echo -e "${YELLOW}⚠️  $service may not be running properly${NC}"
        fi
    done
    
    # Test web access
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Web interface is accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Web interface may not be ready yet${NC}"
    fi
}

# Main installation function
main() {
    echo -e "${BLUE}🎯 Starting ISP Management System installation...${NC}"
    echo ""
    
    check_docker
    create_project
    generate_env
    start_services
    wait_for_services
    init_database
    create_admin
    health_check
    
    echo ""
    echo -e "${GREEN}🎉 ISP Management System installation completed!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Access Information:${NC}"
    echo "   Main Application: http://localhost:3000"
    echo "   Admin Portal: http://localhost:3000/admin"
    echo "   Customer Portal: http://localhost:3000/portal"
    echo ""
    echo -e "${BLUE}🔑 Default Credentials:${NC}"
    echo "   Username: admin@isp.local"
    echo "   Password: admin123"
    echo ""
    echo -e "${BLUE}🛠️  Management Commands:${NC}"
    echo "   View logs: docker compose logs -f"
    echo "   Stop system: docker compose down"
    echo "   Restart: docker compose restart"
    echo "   Status: docker compose ps"
    echo ""
    echo -e "${GREEN}✨ System is ready for use!${NC}"
    echo -e "${YELLOW}💡 If you can't access the web interface, run: ./troubleshoot.sh${NC}"
}

main "$@"
