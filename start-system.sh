#!/bin/bash

# ISP Management System Startup Script
set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting ISP Management System...${NC}"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start services
echo -e "${BLUE}📦 Starting services...${NC}"
docker compose up -d --build

# Wait for services
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 20

# Check health
echo -e "${BLUE}🔍 Checking service health...${NC}"
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e "${GREEN}✅ All services are healthy!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo -e "${GREEN}🎉 ISP Management System is running!${NC}"
echo ""
echo -e "${BLUE}🌐 Access URLs:${NC}"
echo "   Main Application: http://localhost:3000"
echo "   Health Check: http://localhost:3000/api/health"
echo ""
echo -e "${BLUE}📊 Database Access:${NC}"
echo "   Host: localhost:5432"
echo "   Database: isp_system"
echo "   Username: isp_user"
echo "   Password: isp_password_2024"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo "   View logs: docker compose logs -f"
echo "   Stop system: docker compose down"
echo "   Restart: docker compose restart"
echo "   View status: docker compose ps"
echo ""
echo -e "${GREEN}✨ System ready for use!${NC}"
