#!/bin/bash

# ISP Management System - Troubleshooting Script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 ISP Management System Troubleshooting${NC}"
echo ""

# Check Docker status
check_docker() {
    echo -e "${BLUE}🐳 Checking Docker status...${NC}"
    
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        return 1
    fi
    
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running${NC}"
        echo -e "${YELLOW}💡 Try: sudo systemctl start docker${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Docker is running${NC}"
    return 0
}

# Check container status
check_containers() {
    echo -e "${BLUE}📦 Checking container status...${NC}"
    
    if ! docker compose ps >/dev/null 2>&1; then
        echo -e "${RED}❌ No containers found${NC}"
        echo -e "${YELLOW}💡 Run: docker compose up -d${NC}"
        return 1
    fi
    
    echo "Container Status:"
    docker compose ps
    echo ""
    
    # Check if main app is running
    if docker compose ps | grep -q "isp_app.*Up"; then
        echo -e "${GREEN}✅ Main application container is running${NC}"
    else
        echo -e "${RED}❌ Main application container is not running${NC}"
        return 1
    fi
    
    return 0
}

# Check ports
check_ports() {
    echo -e "${BLUE}🔌 Checking port availability...${NC}"
    
    ports=(3000 80 443 3306 6379)
    
    for port in "${ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            echo -e "${GREEN}✅ Port $port is in use${NC}"
        else
            echo -e "${YELLOW}⚠️  Port $port is not in use${NC}"
        fi
    done
    
    # Check if port 3000 is accessible
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Port 3000 is accessible${NC}"
    else
        echo -e "${RED}❌ Port 3000 is not accessible${NC}"
        return 1
    fi
    
    return 0
}

# Check application logs
check_logs() {
    echo -e "${BLUE}📋 Checking application logs...${NC}"
    
    echo "Recent logs from main application:"
    docker compose logs --tail=20 isp_app 2>/dev/null || echo "No logs available"
    echo ""
    
    echo "Recent logs from MySQL:"
    docker compose logs --tail=10 mysql 2>/dev/null || echo "No MySQL logs available"
    echo ""
}

# Test database connection
test_database() {
    echo -e "${BLUE}🗄️  Testing database connection...${NC}"
    
    if docker compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo -e "${GREEN}✅ Database is accessible${NC}"
    else
        echo -e "${RED}❌ Database is not accessible${NC}"
        return 1
    fi
    
    return 0
}

# Test web interface
test_web() {
    echo -e "${BLUE}🌐 Testing web interface...${NC}"
    
    # Test different URLs
    urls=("http://localhost:3000" "http://localhost:3000/api/database/status" "http://localhost")
    
    for url in "${urls[@]}"; do
        if curl -f "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ $url is accessible${NC}"
        else
            echo -e "${RED}❌ $url is not accessible${NC}"
        fi
    done
}

# Fix common issues
fix_issues() {
    echo -e "${BLUE}🔧 Attempting to fix common issues...${NC}"
    
    echo -e "${YELLOW}🔄 Restarting containers...${NC}"
    docker compose down
    sleep 5
    docker compose up -d
    
    echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
    sleep 30
    
    echo -e "${GREEN}✅ Restart completed${NC}"
}

# Show system information
show_system_info() {
    echo -e "${BLUE}💻 System Information:${NC}"
    echo "OS: $(uname -s)"
    echo "Architecture: $(uname -m)"
    echo "Docker Version: $(docker --version 2>/dev/null || echo 'Not installed')"
    echo "Docker Compose Version: $(docker compose version 2>/dev/null || echo 'Not installed')"
    echo "Available Memory: $(free -h 2>/dev/null | grep Mem | awk '{print $7}' || echo 'Unknown')"
    echo "Available Disk: $(df -h . | tail -1 | awk '{print $4}' || echo 'Unknown')"
    echo ""
}

# Main troubleshooting function
main() {
    echo -e "${BLUE}🎯 Starting troubleshooting process...${NC}"
    echo ""
    
    show_system_info
    
    if ! check_docker; then
        echo -e "${RED}❌ Docker issues detected. Please fix Docker installation first.${NC}"
        exit 1
    fi
    
    if ! check_containers; then
        echo -e "${YELLOW}🔧 Container issues detected. Attempting to fix...${NC}"
        fix_issues
        
        # Check again after fix
        if ! check_containers; then
            echo -e "${RED}❌ Unable to fix container issues${NC}"
            exit 1
        fi
    fi
    
    if ! test_database; then
        echo -e "${YELLOW}⚠️  Database connection issues detected${NC}"
    fi
    
    if ! check_ports; then
        echo -e "${YELLOW}⚠️  Port accessibility issues detected${NC}"
    fi
    
    test_web
    check_logs
    
    echo ""
    echo -e "${GREEN}🎉 Troubleshooting completed!${NC}"
    echo ""
    echo -e "${BLUE}🌐 Try accessing the system at:${NC}"
    echo "   http://localhost:3000"
    echo "   http://localhost"
    echo ""
    echo -e "${BLUE}🛠️  If issues persist:${NC}"
    echo "   1. Check firewall settings"
    echo "   2. Ensure no other services are using ports 3000, 80, 3306"
    echo "   3. Try: docker compose down && docker compose up -d --build"
    echo "   4. Check Docker Desktop is running (if on Windows/Mac)"
    echo ""
}

main "$@"
