#!/bin/bash

# ISP Management System - Troubleshooting Script
# This script diagnoses and fixes common issues

set -e

echo "🔧 ISP Management System - Troubleshooting"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

print_step "Checking Docker installation..."
if command_exists docker; then
    print_status "✅ Docker is installed: $(docker --version)"
else
    print_error "❌ Docker is not installed"
    echo "Run: ./install-prerequisites.sh"
    exit 1
fi

print_step "Checking Docker service status..."
if systemctl is-active --quiet docker; then
    print_status "✅ Docker service is running"
else
    print_warning "⚠️ Docker service is not running. Starting..."
    sudo systemctl start docker
fi

print_step "Checking Docker permissions..."
if docker info >/dev/null 2>&1; then
    print_status "✅ Docker permissions are correct"
else
    print_warning "⚠️ Docker permission issue detected"
    echo "Run: sudo usermod -aG docker $USER && newgrp docker"
fi

print_step "Checking Docker Compose..."
if command_exists docker-compose; then
    print_status "✅ Docker Compose is installed: $(docker-compose --version)"
else
    print_error "❌ Docker Compose is not installed"
    echo "Run: ./install-prerequisites.sh"
    exit 1
fi

print_step "Checking port availability..."
if port_in_use 3000; then
    print_warning "⚠️ Port 3000 is in use"
    echo "Process using port 3000:"
    lsof -i :3000
    echo ""
    echo "To kill the process: sudo kill -9 \$(lsof -t -i:3000)"
else
    print_status "✅ Port 3000 is available"
fi

if port_in_use 5432; then
    print_warning "⚠️ Port 5432 (PostgreSQL) is in use"
    echo "This might conflict with the database container"
else
    print_status "✅ Port 5432 is available"
fi

print_step "Checking project directory..."
if [ -d "isp-management-system" ]; then
    print_status "✅ Project directory exists"
    cd isp-management-system
    
    print_step "Checking Docker containers..."
    if docker-compose ps | grep -q "Up"; then
        print_status "✅ Some containers are running"
        docker-compose ps
    else
        print_warning "⚠️ No containers are running"
        echo "Starting containers..."
        docker-compose up -d
    fi
    
    print_step "Checking container health..."
    sleep 10
    
    # Check app container
    if docker-compose ps | grep "isp_app" | grep -q "Up"; then
        print_status "✅ Application container is running"
    else
        print_error "❌ Application container is not running"
        echo "Application logs:"
        docker-compose logs isp_app
    fi
    
    # Check database container
    if docker-compose ps | grep "isp_postgres" | grep -q "Up"; then
        print_status "✅ Database container is running"
    else
        print_error "❌ Database container is not running"
        echo "Database logs:"
        docker-compose logs isp_postgres
    fi
    
    print_step "Testing application connectivity..."
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        print_status "✅ Application is responding"
        echo "🌐 Access your system at: http://localhost:3000"
    else
        print_warning "⚠️ Application is not responding"
        echo "Checking application logs..."
        docker-compose logs --tail=20 isp_app
        
        print_step "Attempting to restart application..."
        docker-compose restart isp_app
        sleep 15
        
        if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
            print_status "✅ Application is now responding after restart"
            echo "🌐 Access your system at: http://localhost:3000"
        else
            print_error "❌ Application is still not responding"
            echo "Full application logs:"
            docker-compose logs isp_app
        fi
    fi
    
else
    print_error "❌ Project directory not found"
    echo "Run: ./complete-system-install.sh"
    exit 1
fi

print_step "System Status Summary:"
echo "======================"
docker-compose ps

echo ""
print_status "Troubleshooting completed!"
echo ""
echo "If issues persist:"
echo "1. Check logs: docker-compose logs -f"
echo "2. Restart system: docker-compose restart"
echo "3. Rebuild system: docker-compose up --build -d"
echo "4. Clean restart: docker-compose down && docker-compose up -d"
