#!/bin/bash

# ISP Management System - One Command Installation
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 ISP Management System - One Command Installation${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Function to check if script exists and is executable
check_script() {
    local script_name=$1
    if [ ! -f "$script_name" ]; then
        echo -e "${RED}❌ Script $script_name not found${NC}"
        return 1
    fi
    
    if [ ! -x "$script_name" ]; then
        echo -e "${YELLOW}⚠️  Making $script_name executable...${NC}"
        chmod +x "$script_name"
    fi
    
    return 0
}

# Main installation process
main() {
    echo -e "${BLUE}🎯 Starting automated installation process...${NC}"
    echo ""
    
    # Step 1: Install Prerequisites
    echo -e "${BLUE}📋 Step 1: Installing Prerequisites${NC}"
    echo -e "${BLUE}=================================${NC}"
    
    if check_script "install-prerequisites.sh"; then
        ./install-prerequisites.sh
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Prerequisites installation failed${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ install-prerequisites.sh not found${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ Prerequisites installation completed${NC}"
    echo ""
    
    # Step 2: Install Complete System
    echo -e "${BLUE}🏗️  Step 2: Installing Complete System${NC}"
    echo -e "${BLUE}====================================${NC}"
    
    if check_script "complete-system-install.sh"; then
        ./complete-system-install.sh
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ System installation failed${NC}"
            exit 1
        fi
    else
        echo -e "${RED}❌ complete-system-install.sh not found${NC}"
        exit 1
    fi
    
    echo ""
    echo -e "${GREEN}✅ System installation completed${NC}"
    echo ""
    
    # Final success message
    echo -e "${GREEN}🎉 ISP Management System Installation Completed Successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    echo ""
    echo -e "${BLUE}🌐 Your system is now available at:${NC}"
    echo "   http://localhost:3000"
    echo "   http://localhost (via Nginx)"
    echo ""
    echo -e "${BLUE}📋 Default Login Credentials:${NC}"
    echo "   Username: admin@yourisp.com"
    echo "   Password: admin123"
    echo ""
    echo -e "${BLUE}🛠️  Useful Commands:${NC}"
    echo "   ./start-system.sh         # Start the system"
    echo "   docker compose down       # Stop the system"
    echo "   docker compose logs -f    # View system logs"
    echo "   ./troubleshoot.sh         # Troubleshoot issues"
    echo ""
    echo -e "${BLUE}📁 Important Files:${NC}"
    echo "   .env.local               # Environment configuration"
    echo "   docker-compose.yml       # Docker services configuration"
    echo "   scripts/                 # Database initialization scripts"
    echo ""
    echo -e "${YELLOW}⚠️  Security Reminders:${NC}"
    echo "   1. Change default passwords immediately"
    echo "   2. Update .env.local with your SMTP settings"
    echo "   3. Configure SSL certificates for production"
    echo "   4. Set up regular database backups"
    echo ""
    echo -e "${GREEN}🚀 Your ISP Management System is ready to use!${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please do not run this script as root${NC}"
    echo -e "${YELLOW}💡 Run as regular user: ./one-command-install.sh${NC}"
    exit 1
fi

# Run main installation
main "$@"
