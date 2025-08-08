#!/bin/bash

# ISP Management System - One Command Installation
# This script installs everything needed for the ISP management system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ISP Management System - Complete Installation${NC}"
echo "================================================="
echo ""
echo "This script will:"
echo "1. Install all prerequisites (Docker, Node.js, Git)"
echo "2. Create the complete ISP management system"
echo "3. Start all services"
echo ""

# Ask for confirmation
read -p "Do you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 1
fi

echo ""
echo -e "${BLUE}📋 Step 1: Installing Prerequisites${NC}"
echo "=================================="

# Check if prerequisites script exists
if [ ! -f "install-prerequisites.sh" ]; then
    echo -e "${RED}❌ install-prerequisites.sh not found in current directory${NC}"
    echo "Please make sure you're in the correct directory with all installation scripts."
    exit 1
fi

# Make scripts executable
chmod +x install-prerequisites.sh
chmod +x complete-system-install.sh

# Run prerequisites installation
echo -e "${BLUE}🔧 Installing system prerequisites...${NC}"
./install-prerequisites.sh

echo ""
echo -e "${BLUE}📋 Step 2: Installing ISP Management System${NC}"
echo "=========================================="

# Run complete system installation
echo -e "${BLUE}🏗️  Creating ISP management system...${NC}"
./complete-system-install.sh

echo ""
echo -e "${BLUE}📋 Step 3: Starting the System${NC}"
echo "=============================="

# Navigate to the created directory
cd isp-management-system

# Start the system
echo -e "${BLUE}🚀 Starting all services...${NC}"
./start-system.sh

echo ""
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📍 System Information:${NC}"
echo "   • Location: $(pwd)"
echo "   • Web Interface: http://localhost:3000"
echo "   • Health Check: http://localhost:3000/api/health"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo "   • Start system: ./start-system.sh"
echo "   • Troubleshoot: ./troubleshoot.sh"
echo "   • View logs: docker compose logs -f"
echo "   • Stop system: docker compose down"
echo ""
echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "1. Use HTTP (not HTTPS): http://localhost:3000"
echo "2. If you can't connect, run: ./troubleshoot.sh"
echo "3. The system may take 2-3 minutes to fully start"
echo ""
echo -e "${GREEN}🎊 Enjoy your ISP Management System!${NC}"
