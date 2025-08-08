#!/bin/bash

# ISP Management System - Troubleshooting Script
# This script helps diagnose and fix common issues

echo "🔧 ISP Management System Troubleshooting"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

# Check Docker
echo ""
echo "1. Checking Docker..."
echo "===================="
if command -v docker &> /dev/null; then
    print_status "Docker is installed: $(docker --version)"
    
    if docker info > /dev/null 2>&1; then
        print_status "Docker daemon is running"
    else
        print_error "Docker daemon is not running"
        print_info "Try: sudo systemctl start docker"
        exit 1
    fi
else
    print_error "Docker is not installed"
    print_info "Run: ./install-prerequisites.sh"
    exit 1
fi

# Check Docker Compose
echo ""
echo "2. Checking Docker Compose..."
echo "============================="
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        print_status "Docker Compose is available: $(docker-compose --version)"
    else
        print_status "Docker Compose is available: $(docker compose version)"
    fi
else
    print_error "Docker Compose is not available"
    exit 1
fi

# Check containers
echo ""
echo "3. Checking Container Status..."
echo "==============================="
if [ -f "docker-compose.yml" ]; then
    print_status "docker-compose.yml found"
    
    echo ""
    echo "Container Status:"
    docker compose ps
    
    # Check if containers are running
    if docker compose ps | grep -q "Up"; then
        print_status "Some containers are running"
    else
        print_warning "No containers are running"
        print_info "Starting containers..."
        docker compose up -d
        sleep 10
    fi
else
    print_error "docker-compose.yml not found"
    print_info "Make sure you're in the correct directory"
    exit 1
fi

# Check ports
echo ""
echo "4. Checking Port Availability..."
echo "================================"
if netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    print_status "Port 3000 is in use"
    print_info "Process using port 3000:"
    lsof -i :3000 2>/dev/null || netstat -tulpn 2>/dev/null | grep :3000
elif ss -tuln 2>/dev/null | grep -q ":3000 "; then
    print_status "Port 3000 is in use"
    print_info "Process using port 3000:"
    ss -tulpn | grep :3000
else
    print_warning "Port 3000 is not in use"
    print_info "The application might not be running"
fi

# Check application health
echo ""
echo "5. Checking Application Health..."
echo "================================="
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "Application is responding at http://localhost:3000"
else
    print_error "Application is not responding"
    print_info "Checking application logs..."
    echo ""
    echo "Recent application logs:"
    docker compose logs --tail=20 app 2>/dev/null || echo "No logs available"
fi

# Check database
echo ""
echo "6. Checking Database..."
echo "======================="
if docker compose exec -T postgres pg_isready -U isp_admin -d isp_management > /dev/null 2>&1; then
    print_status "Database is ready"
else
    print_error "Database is not ready"
    print_info "Checking database logs..."
    echo ""
    echo "Recent database logs:"
    docker compose logs --tail=20 postgres 2>/dev/null || echo "No logs available"
fi

# System resources
echo ""
echo "7. Checking System Resources..."
echo "==============================="
echo "Docker system info:"
docker system df

echo ""
echo "Container resource usage:"
docker stats --no-stream 2>/dev/null || echo "Unable to get container stats"

# Common fixes
echo ""
echo "8. Common Fixes..."
echo "=================="
echo ""
echo "If the system is not working, try these fixes:"
echo ""
echo "🔄 Restart all services:"
echo "   docker compose down && docker compose up -d"
echo ""
echo "🧹 Clean restart (removes all data):"
echo "   docker compose down -v"
echo "   docker system prune -f"
echo "   docker compose up -d"
echo ""
echo "📋 View detailed logs:"
echo "   docker compose logs -f"
echo ""
echo "🔍 Check specific service logs:"
echo "   docker compose logs -f app"
echo "   docker compose logs -f postgres"
echo "   docker compose logs -f redis"
echo ""
echo "🌐 Access URLs to try:"
echo "   • http://localhost:3000 (NOT https://)"
echo "   • http://127.0.0.1:3000"
echo "   • http://0.0.0.0:3000"
echo ""
echo "⚙️ Environment check:"
echo "   cat .env"
echo ""

# Auto-fix attempt
echo ""
echo "9. Auto-fix Attempt..."
echo "======================"
read -p "Would you like to attempt an automatic restart? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Attempting automatic restart..."
    
    # Stop services
    print_info "Stopping services..."
    docker compose down
    
    # Wait a moment
    sleep 5
    
    # Start services
    print_info "Starting services..."
    docker compose up -d
    
    # Wait for startup
    print_info "Waiting for services to start..."
    sleep 30
    
    # Test again
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_status "✅ Auto-fix successful! System is now responding."
        echo ""
        echo "🌐 Access your system at: http://localhost:3000"
    else
        print_warning "Auto-fix completed, but system may still be starting up."
        print_info "Wait 2-3 minutes and try accessing http://localhost:3000"
        print_info "If issues persist, check the logs: docker compose logs -f"
    fi
fi

echo ""
echo "🔧 Troubleshooting Complete"
echo "=========================="
echo ""
echo "If you're still having issues:"
echo "1. Check the logs: docker compose logs -f"
echo "2. Ensure you're using HTTP (not HTTPS): http://localhost:3000"
echo "3. Wait a few minutes for all services to fully start"
echo "4. Try the clean restart option above"
echo ""
