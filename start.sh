#!/bin/bash

# Quick Start Script for ISP Management System
# This script starts the system immediately

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting ISP Management System...${NC}"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if configuration exists
if [ ! -f ".env" ] || [ ! -f "docker-compose.yml" ]; then
    echo -e "${YELLOW}⚠️  Configuration files missing. Running quick setup...${NC}"
    ./quick-install.sh
fi

echo -e "${BLUE}📦 Building and starting containers...${NC}"
docker compose up -d --build

echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 15

# Wait for database
echo -e "${BLUE}🗄️  Waiting for database...${NC}"
while ! docker exec isp_postgres pg_isready -U isp_user -d isp_system >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo ""

echo -e "${GREEN}✅ ISP Management System is running!${NC}"
echo ""
echo -e "${BLUE}🌐 Access your system:${NC}"
echo "   Web Interface: http://localhost:3000"
echo "   Database: localhost:5432"
echo ""
echo -e "${BLUE}📊 Sample data included:${NC}"
echo "   • 8 customers with profiles"
echo "   • 8 service plans"
echo "   • Payment history"
echo "   • Company settings"
echo ""
echo -e "${BLUE}🛠️  Management commands:${NC}"
echo "   • View logs: docker compose logs -f"
echo "   • Stop system: docker compose down"
echo "   • Restart: docker compose restart"
echo ""
echo -e "${GREEN}🎉 Happy managing!${NC}"
