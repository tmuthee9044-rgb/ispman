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
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "✅ Docker already installed (version $DOCKER_VERSION)"
        
        # Check if Docker is running
        if ! docker info >/dev/null 2>&1; then
            print_step "Starting Docker service..."
            if [[ "$OS" == "macos" ]]; then
                print_warning "Please start Docker Desktop manually"
                read -p "Press Enter after Docker Desktop is running..."
            else
                sudo systemctl start docker
                sudo systemctl enable docker
            fi
        fi
        return
    fi

    print_step "Installing Docker..."
    
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            # Ubuntu/Debian
            sudo apt-get update
            sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        elif [[ "$DISTRO" == "redhat" ]]; then
            # CentOS/RHEL/Fedora
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        fi
        
        # Start Docker service
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        
    elif [[ "$OS" == "macos" ]]; then
        if command_exists brew; then
            brew install --cask docker
        else
            print_error "❌ Please install Homebrew first or download Docker Desktop manually"
            exit 1
        fi
    fi
    
    print_success "✅ Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    if command_exists docker-compose || docker compose version >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "✅ Docker Compose already available (version $COMPOSE_VERSION)"
        return
    fi

    print_step "Installing Docker Compose..."
    
    if [[ "$OS" == "linux" ]]; then
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    print_success "✅ Docker Compose installed successfully"
}

# Install Node.js
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "✅ Node.js $NODE_VERSION already installed"
            return
        else
            print_warning "Node.js version $NODE_VERSION is too old, upgrading to Node.js 18..."
        fi
    fi

    print_step "Installing Node.js 18..."
    
    if [[ "$OS" == "linux" ]]; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt-get install -y nodejs
        elif [[ "$DISTRO" == "redhat" ]]; then
            sudo yum install -y nodejs npm
        fi
    elif [[ "$OS" == "macos" ]]; then
        if command_exists brew; then
            brew install node
        else
            print_error "❌ Please install Homebrew first"
            exit 1
        fi
    fi
    
    print_success "✅ Node.js installed successfully"
}

# Install Git
install_git() {
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "✅ Git already installed (version $GIT_VERSION)"
        return
    fi

    print_step "Installing Git..."
    
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt-get update
            sudo apt-get install -y git
        elif [[ "$DISTRO" == "redhat" ]]; then
            sudo yum install -y git
        fi
    elif [[ "$OS" == "macos" ]]; then
        if command_exists brew; then
            brew install git
        else
            # Git comes with Xcode command line tools
            xcode-select --install
        fi
    fi
    
    print_success "✅ Git installed successfully"
}

# Install additional tools
install_tools() {
    print_step "Installing additional tools..."
    
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt-get install -y curl wget unzip zip jq htop net-tools postgresql-client
        elif [[ "$DISTRO" == "redhat" ]]; then
            if command_exists dnf; then
                sudo dnf install -y curl wget unzip zip jq htop net-tools postgresql
            else
                sudo yum install -y curl wget unzip zip jq htop net-tools postgresql
            fi
        fi
    elif [[ "$OS" == "macos" ]]; then
        if command_exists brew; then
            brew install curl wget jq htop postgresql
        fi
    fi
    
    print_success "✅ Additional tools installed"
}

# Main installation function
main() {
    print_header "ISP Management System - Prerequisites Installation"
    echo ""
    print_info "This script will install all required prerequisites:"
    echo "  • Docker & Docker Compose"
    echo "  • Node.js 18+ & npm"
    echo "  • Git"
    echo "  • System utilities"
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
    
    # Detect OS
    detect_os
    
    # Install prerequisites
    update_system
    install_docker
    install_docker_compose
    install_nodejs
    install_git
    install_tools
    
    echo ""
    echo -e "${GREEN}🎉 All prerequisites installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 Installed components:${NC}"
    echo "   ✅ Git: $(git --version 2>/dev/null || echo 'Not found')"
    echo "   ✅ Node.js: $(node --version 2>/dev/null || echo 'Not found')"
    echo "   ✅ Docker: $(docker --version 2>/dev/null || echo 'Not found')"
    echo "   ✅ Docker Compose: $(docker-compose --version 2>/dev/null || docker compose version 2>/dev/null || echo 'Not found')"
    echo ""
    
    if [[ "$OS" == "linux" ]]; then
        echo -e "${YELLOW}⚠️  You may need to log out and back in for Docker permissions to take effect${NC}"
        echo -e "${YELLOW}   Or run: newgrp docker${NC}"
    fi
    
    echo -e "${GREEN}✨ Ready to install ISP Management System!${NC}"
}

# Run main function
main "$@"
