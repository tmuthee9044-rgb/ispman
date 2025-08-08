#!/bin/bash

# ISP Management System - One Command Installation
# This script runs the complete installation process

set -e

echo "🚀 ISP Management System - One Command Installation"
echo "=================================================="
echo ""
echo "This script will:"
echo "1. Install all prerequisites (Docker, Node.js, Git)"
echo "2. Create and configure the ISP management system"
echo "3. Start all services"
echo ""

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

print_header() {
    echo -e "${BLUE}[PHASE]${NC} $1"
}

# Check if scripts exist
if [ ! -f "install-prerequisites.sh" ]; then
    print_error "install-prerequisites.sh not found!"
    exit 1
fi

if [ ! -f "complete-system-install.sh" ]; then
    print_error "complete-system-install.sh not found!"
    exit 1
fi

# Make scripts executable
chmod +x install-prerequisites.sh
chmod +x complete-system-install.sh

# Phase 1: Install Prerequisites
print_header "Phase 1: Installing Prerequisites"
echo "=================================="
./install-prerequisites.sh

# Check if we need to restart for Docker group changes
if [[ "$OSTYPE" == "linux-gnu"* ]] && ! groups $USER | grep -q docker; then
    print_warning "Docker group changes detected. You may need to:"
    print_warning "1. Log out and back in, OR"
    print_warning "2. Run: newgrp docker"
    print_warning "3. Then re-run this script"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Installation paused. Please restart your session and re-run this script."
        exit 0
    fi
fi

echo ""
print_header "Phase 2: Installing ISP Management System"
echo "=========================================="
./complete-system-install.sh

echo ""
echo "🎉 INSTALLATION COMPLETE!"
echo "========================"
echo ""
echo "Your ISP Management System is now running!"
echo ""
echo "🌐 Access your system at: http://localhost:3000"
echo ""
echo "📋 Quick Start:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Login with: admin@yourisp.com / admin123"
echo "   3. Change the default password"
echo "   4. Start managing your ISP business!"
echo ""
echo "🛠️ Useful Commands:"
echo "   • Check status:    ./status.sh"
echo "   • View logs:       docker compose logs -f"
echo "   • Stop system:     docker compose down"
echo "   • Start system:    docker compose up -d"
echo "   • Troubleshoot:    ./troubleshoot.sh"
echo ""
echo "📚 Need help? Check QUICK_START.md for detailed instructions."
echo ""

# Final health check
print_status "Performing final health check..."
sleep 5

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ System is healthy and ready to use!"
else
    echo "⚠️  System may still be starting up. Please wait a few more minutes."
    echo "   Run './troubleshoot.sh' if issues persist."
fi

echo ""
echo "🚀 Happy ISP Management! 🚀"
