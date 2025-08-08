#!/bin/bash

# ISP Management System - One Command Installation
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 ISP Management System - One Command Installation${NC}"
echo -e "${BLUE}===================================================${NC}"
echo ""

# Make scripts executable
chmod +x install-prerequisites.sh
chmod +x complete-system-install.sh
chmod +x troubleshoot.sh
chmod +x start-system.sh

echo -e "${BLUE}📋 Installation Steps:${NC}"
echo "   1. Install prerequisites (Docker, Node.js, etc.)"
echo "   2. Install ISP Management System"
echo "   3. Start all services"
echo "   4. Run health checks"
echo ""

read -p "Press Enter to continue with installation..."

# Step 1: Install prerequisites
echo -e "${BLUE}🔧 Step 1: Installing prerequisites...${NC}"
./install-prerequisites.sh

echo ""
echo -e "${GREEN}✅ Prerequisites installation completed!${NC}"
echo ""

# Step 2: Install ISP system
echo -e "${BLUE}🏗️  Step 2: Installing ISP Management System...${NC}"
./complete-system-install.sh

echo ""
echo -e "${GREEN}✅ ISP Management System installation completed!${NC}"
echo ""

# Step 3: Final health check and troubleshooting
echo -e "${BLUE}🔍 Step 3: Running final health checks...${NC}"
sleep 5
./troubleshoot.sh

echo ""
echo -e "${GREEN}🎉 INSTALLATION COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo -e "${BLUE}🌐 Your ISP Management System is now running at:${NC}"
echo ""
echo -e "${GREEN}   ➤ Main Application: http://localhost:3000${NC}"
echo -e "${GREEN}   ➤ Admin Portal: http://localhost:3000/admin${NC}"
echo -e "${GREEN}   ➤ Customer Portal: http://localhost:3000/portal${NC}"
echo ""
echo -e "${BLUE}🔑 Default Login Credentials:${NC}"
echo "   Username: admin@isp.local"
echo "   Password: admin123"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo "   Start system: ./start-system.sh"
echo "   Stop system: docker compose down"
echo "   View logs: docker compose logs -f"
echo "   Troubleshoot: ./troubleshoot.sh"
echo ""
echo -e "${YELLOW}💡 If you can't access the web interface:${NC}"
echo "   1. Wait 2-3 minutes for all services to fully start"
echo "   2. Try http://localhost:3000 (not https://)"
echo "   3. Run ./troubleshoot.sh for detailed diagnostics"
echo ""
echo -e "${GREEN}✨ Enjoy your ISP Management System!${NC}"
