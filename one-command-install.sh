#!/bin/bash

# ISP Management System - One Command Complete Installation
# This script installs prerequisites and creates the complete ISP system

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

# Main installation function
main() {
    print_header "🚀 ISP Management System - One Command Installation"
    echo ""
    print_info "This script will:"
    echo "1. Install all system prerequisites (Docker, Node.js, Git, etc.)"
    echo "2. Create the complete ISP management system"
    echo "3. Set up all services and configurations"
    echo "4. Provide you with a ready-to-use system"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        print_error "Please do not run this script as root"
        print_info "The script will ask for sudo permissions when needed"
        exit 1
    fi
    
    # Check for sudo access
    if ! sudo -n true 2>/dev/null; then
        print_info "This script requires sudo access for system package installation"
        sudo -v
    fi
    
    print_info "Starting complete installation process..."
    echo ""
    
    # Step 1: Install Prerequisites
    print_header "STEP 1: Installing Prerequisites"
    if [ -f "./install-prerequisites.sh" ]; then
        chmod +x ./install-prerequisites.sh
        ./install-prerequisites.sh
    else
        print_error "install-prerequisites.sh not found!"
        print_info "Please ensure all installation scripts are in the current directory"
        exit 1
    fi
    
    echo ""
    print_success "Prerequisites installation completed!"
    echo ""
    
    # Step 2: Create Complete System
    print_header "STEP 2: Creating ISP Management System"
    if [ -f "./complete-system-install.sh" ]; then
        chmod +x ./complete-system-install.sh
        ./complete-system-install.sh
    else
        print_error "complete-system-install.sh not found!"
        print_info "Please ensure all installation scripts are in the current directory"
        exit 1
    fi
    
    echo ""
    print_success "System creation completed!"
    echo ""
    
    # Final success message
    print_header "🎉 COMPLETE INSTALLATION FINISHED!"
    echo ""
    print_success "🎯 ISP Management System is ready!"
    echo ""
    print_info "🚀 TO START THE SYSTEM:"
    echo "   ./start-system.sh"
    echo ""
    print_info "🌐 SYSTEM ACCESS:"
    echo "   Main Application: http://localhost:3000"
    echo "   Health Check: http://localhost:3000/api/health"
    echo ""
    print_info "📊 DATABASE ACCESS:"
    echo "   Host: localhost:5432"
    echo "   Database: isp_system"
    echo "   Username: isp_user"
    echo "   Password: isp_password_2024"
    echo ""
    print_info "🛠️  MANAGEMENT COMMANDS:"
    echo "   View logs: docker compose logs -f"
    echo "   Stop system: docker compose down"
    echo "   Restart: docker compose restart"
    echo "   View status: docker compose ps"
    echo ""
    print_info "📋 SYSTEM FEATURES:"
    echo "   ✅ Customer Management Dashboard"
    echo "   ✅ Service Plans & Billing System"
    echo "   ✅ Network Equipment Monitoring"
    echo "   ✅ Support Ticket Management"
    echo "   ✅ Analytics & Reporting"
    echo "   ✅ M-Pesa Integration Ready"
    echo "   ✅ Real-time Health Monitoring"
    echo "   ✅ 50+ Sample Customers"
    echo "   ✅ 8 Service Plans (KES 1,200 - KES 35,000)"
    echo ""
    print_success "🎊 Installation Complete! Your ISP system is ready to use!"
    echo ""
    print_warning "💡 NEXT STEPS:"
    echo "1. Run: ./start-system.sh"
    echo "2. Wait 2-3 minutes for all services to start"
    echo "3. Open: http://localhost:3000"
    echo "4. Explore the dashboard and features"
    echo ""
    print_info "📚 For support and documentation, check the README.md file"
}

# Run main function
main "$@"
