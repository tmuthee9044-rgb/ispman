#!/bin/bash

# ISP Management System - One-Command Installer
# This script downloads and installs the complete ISP management system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="https://github.com/tmuthee9044-rgb/ispman.git"
INSTALL_DIR="ispman"

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_header "ISP Management System - One-Command Installer"
echo ""
print_info "This installer will:"
print_info "✓ Download the complete ISP management system from GitHub"
print_info "✓ Install all dependencies automatically"
print_info "✓ Set up Docker containers with database"
print_info "✓ Configure everything for immediate use"
echo ""

# Check if Git is installed
if ! command_exists git; then
    print_step "Installing Git..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update -qq
        sudo apt-get install -y -qq git
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command_exists brew; then
            brew install git
        else
            print_error "Please install Git manually on macOS"
            exit 1
        fi
    fi
    print_success "Git installed successfully"
else
    print_success "Git is already installed"
fi

# Remove existing installation if it exists
if [ -d "$INSTALL_DIR" ]; then
    print_warning "Existing installation found at $INSTALL_DIR"
    read -p "Do you want to remove it and install fresh? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_step "Removing existing installation..."
        rm -rf "$INSTALL_DIR"
        print_success "Existing installation removed"
    else
        print_info "Installation cancelled by user"
        exit 0
    fi
fi

# Clone the repository
print_step "Downloading ISP Management System from GitHub..."
git clone "$GITHUB_REPO" "$INSTALL_DIR"
print_success "Repository cloned successfully"

# Navigate to the installation directory
cd "$INSTALL_DIR"

# Make setup script executable
chmod +x setup.sh

# Run the main setup script
print_step "Running main installation script..."
./setup.sh

print_header "🎉 One-Command Installation Complete!"
echo ""
print_success "Your ISP Management System has been installed successfully!"
echo ""
print_info "Installation Directory: $(pwd)"
print_info "Access your system at: http://localhost:3000"
echo ""
print_info "To manage your installation:"
echo "• Navigate to: cd $INSTALL_DIR"
echo "• Stop system: docker compose down"
echo "• Start system: docker compose up -d"
echo "• View logs: docker compose logs -f"
echo ""
print_success "Enjoy your new ISP Management System! 🚀"
