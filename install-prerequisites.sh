#!/bin/bash

# ISP Management System - Prerequisites Installation Script
# This script installs ALL required prerequisites for the ISP system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}🔧 Installing Prerequisites for ISP Management System...${NC}"
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

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if [ -f /etc/debian_version ]; then
            DISTRO="debian"
        elif [ -f /etc/redhat-release ]; then
            DISTRO="redhat"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    fi

    print_info "Detected OS: $OS"
}

# Update system packages
update_system() {
    print_step "Updating system packages..."
    
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt-get update -y
            sudo apt-get upgrade -y
            sudo apt-get install -y curl wget gnupg lsb-release ca-certificates software-properties-common apt-transport-https
        elif [[ "$DISTRO" == "redhat" ]]; then
            if command_exists dnf; then
                sudo dnf update -y
                sudo dnf install -y curl wget gnupg ca-certificates
            else
                sudo yum update -y
                sudo yum install -y curl wget gnupg ca-certificates
            fi
        fi
    elif [[ "$OS" == "macos" ]]; then
        if ! command_exists brew; then
            print_step "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew update
    fi
    
    print_success "System packages updated"
}

# Install Docker
install_docker() {
    echo -e "${BLUE}🐳 Installing Docker...${NC}"
    
    OS=$(detect_os)
    
    if command_exists docker; then
        echo -e "${GREEN}✅ Docker is already installed${NC}"
        return 0
    fi
    
    case $OS in
        "debian")
            # Update package index
            sudo apt-get update
            
            # Install required packages
            sudo apt-get install -y \
                ca-certificates \
                curl \
                gnupg \
                lsb-release
            
            # Add Docker's official GPG key
            sudo mkdir -p /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            
            # Set up repository
            echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            # Install Docker Engine
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            ;;
        "redhat")
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
            sudo systemctl start docker
            sudo systemctl enable docker
            ;;
        "macos")
            echo -e "${YELLOW}⚠️  Please install Docker Desktop for Mac from: https://docs.docker.com/desktop/mac/install/${NC}"
            echo -e "${YELLOW}⚠️  After installation, restart this script${NC}"
            exit 1
            ;;
        *)
            echo -e "${RED}❌ Unsupported operating system${NC}"
            exit 1
            ;;
    esac
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
    echo -e "${YELLOW}⚠️  You may need to log out and back in for Docker permissions to take effect${NC}"
}

# Install Node.js
install_nodejs() {
    echo -e "${BLUE}📦 Installing Node.js...${NC}"
    
    if command_exists node; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}✅ Node.js is already installed: $NODE_VERSION${NC}"
        return 0
    fi
    
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    echo -e "${GREEN}✅ Node.js installed successfully${NC}"
    node --version
    npm --version
}

# Install Git
install_git() {
    echo -e "${BLUE}📝 Installing Git...${NC}"
    
    if command_exists git; then
        echo -e "${GREEN}✅ Git is already installed${NC}"
        return 0
    fi
    
    OS=$(detect_os)
    
    case $OS in
        "debian")
            sudo apt-get update
            sudo apt-get install -y git
            ;;
        "redhat")
            sudo yum install -y git
            ;;
        "macos")
            # Git comes with Xcode command line tools
            xcode-select --install 2>/dev/null || true
            ;;
    esac
    
    echo -e "${GREEN}✅ Git installed successfully${NC}"
}

# Install additional tools
install_tools() {
    echo -e "${BLUE}🛠️  Installing additional tools...${NC}"
    
    OS=$(detect_os)
    
    case $OS in
        "debian")
            sudo apt-get update
            sudo apt-get install -y \
                curl \
                wget \
                unzip \
                vim \
                htop \
                net-tools \
                netstat-nat
            ;;
        "redhat")
            sudo yum install -y \
                curl \
                wget \
                unzip \
                vim \
                htop \
                net-tools
            ;;
        "macos")
            # Install Homebrew if not present
            if ! command_exists brew; then
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            
            brew install curl wget unzip vim htop
            ;;
    esac
    
    echo -e "${GREEN}✅ Additional tools installed successfully${NC}"
}

# Check system requirements
check_requirements() {
    echo -e "${BLUE}🔍 Checking system requirements...${NC}"
    
    # Check available memory (minimum 2GB recommended)
    MEMORY_KB=$(grep MemTotal /proc/meminfo 2>/dev/null | awk '{print $2}' || echo "0")
    MEMORY_GB=$((MEMORY_KB / 1024 / 1024))
    
    if [ $MEMORY_GB -lt 2 ]; then
        echo -e "${YELLOW}⚠️  Warning: Less than 2GB RAM detected. System may run slowly.${NC}"
    else
        echo -e "${GREEN}✅ Memory: ${MEMORY_GB}GB${NC}"
    fi
    
    # Check available disk space (minimum 5GB recommended)
    DISK_SPACE=$(df -BG . | tail -1 | awk '{print $4}' | sed 's/G//' || echo "0")
    
    if [ $DISK_SPACE -lt 5 ]; then
        echo -e "${YELLOW}⚠️  Warning: Less than 5GB disk space available.${NC}"
    else
        echo -e "${GREEN}✅ Disk Space: ${DISK_SPACE}GB available${NC}"
    fi
}

# Main installation function
main() {
    echo -e "${BLUE}🎯 Starting prerequisites installation...${NC}"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        echo -e "${RED}❌ Please do not run this script as root${NC}"
        echo -e "${YELLOW}💡 Run as regular user: ./install-prerequisites.sh${NC}"
        exit 1
    fi
    
    check_requirements
    echo ""
    
    install_git
    echo ""
    
    install_nodejs
    echo ""
    
    install_docker
    echo ""
    
    install_tools
    echo ""
    
    echo -e "${GREEN}🎉 Prerequisites installation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Installed components:${NC}"
    echo "   ✅ Docker & Docker Compose"
    echo "   ✅ Node.js & npm"
    echo "   ✅ Git"
    echo "   ✅ Additional system tools"
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "   1. Log out and back in (for Docker permissions)"
    echo "   2. Run: ./complete-system-install.sh"
    echo ""
    echo -e "${YELLOW}⚠️  If you encounter permission issues with Docker, run:${NC}"
    echo "   sudo systemctl restart docker"
    echo "   newgrp docker"
    echo ""
}

# Run main function
main "$@"
