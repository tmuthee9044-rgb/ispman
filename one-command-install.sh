#!/bin/bash

# ISP Management System - One Command Complete Installation
# This master script runs both prerequisite installation and system creation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}================================${NC}"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

# Main function
main() {
    print_header "🚀 ISP Management System - One Command Installation"
    echo ""
    print_info "This will install ALL prerequisites and create a complete ISP management system"
    echo ""
    print_info "What will be installed:"
    echo "  📦 Prerequisites: Docker, Node.js, Git, System utilities"
    echo "  🏗️  Complete ISP System: Next.js app, PostgreSQL, Redis, Nginx"
    echo "  📊 Sample Data: Customers, plans, payments, equipment"
    echo "  🔧 Management Tools: Health monitoring, logging, backups"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_error "Please do not run this script as root"
        print_info "The script will ask for sudo permissions when needed"
        exit 1
    fi
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Installation cancelled"
        exit 0
    fi
    
    echo ""
    print_step "Starting complete installation process..."
    echo ""
    
    # Step 1: Install Prerequisites
    print_header "STEP 1: Installing Prerequisites"
    if [ -f "./install-prerequisites.sh" ]; then
        chmod +x ./install-prerequisites.sh
        ./install-prerequisites.sh
    else
        print_error "install-prerequisites.sh not found!"
        exit 1
    fi
    
    echo ""
    print_success "Prerequisites installation completed!"
    echo ""
    
    # Step 2: Create ISP System
    print_header "STEP 2: Creating ISP Management System"
    if [ -f "./complete-system-install.sh" ]; then
        chmod +x ./complete-system-install.sh
        ./complete-system-install.sh
    else
        print_error "complete-system-install.sh not found!"
        exit 1
    fi
    
    echo ""
    print_success "ISP System creation completed!"
    echo ""
    
    # Final instructions
    print_header "🎉 INSTALLATION COMPLETE!"
    echo ""
    print_success "Your ISP Management System is ready!"
    echo ""
    print_info "🚀 NEXT STEPS:"
    echo "1. Start the system: ./start-system.sh"
    echo "2. Wait 2-3 minutes for all services to start"
    echo "3. Open your browser: http://localhost:3000"
    echo ""
    print_info "📋 WHAT'S INCLUDED:"
    echo "• Complete ISP management dashboard"
    echo "• Customer management with 10 sample customers"
    echo "• 8 service plans (KES 1,200 - KES 35,000)"
    echo "• Payment tracking with M-Pesa integration"
    echo "• Network equipment monitoring"
    echo "• Support ticket system"
    echo "• Real-time analytics and reporting"
    echo ""
    print_info "🛠️  MANAGEMENT COMMANDS:"
    echo "• Start system: ./start-system.sh"
    echo "• View logs: docker compose logs -f"
    echo "• Stop system: docker compose down"
    echo "• System status: docker compose ps"
    echo ""
    print_info "📞 SUPPORT:"
    echo "• Database: PostgreSQL 15 on localhost:5432"
    echo "• Cache: Redis 7 on localhost:6379"
    echo "• Web: Nginx proxy on localhost:80"
    echo "• App: Next.js on localhost:3000"
    echo ""
    print_success "🎯 Ready to manage your ISP business!"
}

# Run main function
main "$@"
