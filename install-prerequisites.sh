#!/bin/bash

# ISP Management System - Prerequisites Installation Script
# This script installs ALL required prerequisites for the ISP system

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

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            OS=$NAME
            VER=$VERSION_ID
        elif type lsb_release >/dev/null 2>&1; then
            OS=$(lsb_release -si)
            VER=$(lsb_release -sr)
        elif [ -f /etc/lsb-release ]; then
            . /etc/lsb-release
            OS=$DISTRIB_ID
            VER=$DISTRIB_RELEASE
        elif [ -f /etc/debian_version ]; then
            OS=Debian
            VER=$(cat /etc/debian_version)
        elif [ -f /etc/SuSe-release ]; then
            OS=openSUSE
        elif [ -f /etc/redhat-release ]; then
            OS=RedHat
        else
            OS=$(uname -s)
            VER=$(uname -r)
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
        VER=$(sw_vers -productVersion)
    elif [[ "$OSTYPE" == "cygwin" ]]; then
        OS="Cygwin"
    elif [[ "$OSTYPE" == "msys" ]]; then
        OS="MinGw"
    else
        OS="Unknown"
    fi
    
    print_info "Detected OS: $OS $VER"
}

# Update system packages
update_system() {
    print_step "Updating system packages..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get update -y
        sudo apt-get upgrade -y
        sudo apt-get install -y curl wget gnupg lsb-release ca-certificates software-properties-common apt-transport-https
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        if command_exists dnf; then
            sudo dnf update -y
            sudo dnf install -y curl wget gnupg ca-certificates
        else
            sudo yum update -y
            sudo yum install -y curl wget gnupg ca-certificates
        fi
    elif [[ "$OS" == "macOS" ]]; then
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
        print_success "Docker already installed (version $DOCKER_VERSION)"
        
        # Check if Docker is running
        if ! docker info >/dev/null 2>&1; then
            print_step "Starting Docker service..."
            if [[ "$OS" == "macOS" ]]; then
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
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Remove old versions
        sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
        
        # Add Docker's official GPG key
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        
        # Add Docker repository
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        
        # Install Docker
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        # Remove old versions
        sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine 2>/dev/null || true
        
        # Add Docker repository
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        
        # Install Docker
        if command_exists dnf; then
            sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        else
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
        fi
        
    elif [[ "$OS" == "macOS" ]]; then
        print_info "Installing Docker Desktop for Mac..."
        if command_exists brew; then
            brew install --cask docker
            print_warning "Please start Docker Desktop from Applications folder"
            read -p "Press Enter after Docker Desktop is running..."
        else
            print_error "Homebrew not found. Please install Docker Desktop manually from https://docker.com/products/docker-desktop"
            exit 1
        fi
    else
        print_error "Unsupported OS for automatic Docker installation: $OS"
        print_info "Please install Docker manually from https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Start and enable Docker (Linux only)
    if [[ "$OS" != "macOS" ]]; then
        sudo systemctl start docker
        sudo systemctl enable docker
        
        # Add current user to docker group
        sudo usermod -aG docker $USER
        print_warning "You may need to log out and back in for Docker group changes to take effect"
    fi
    
    print_success "Docker installed successfully"
}

# Install Docker Compose (if not included with Docker)
install_docker_compose() {
    if docker compose version >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker compose version --short)
        print_success "Docker Compose already installed (version $COMPOSE_VERSION)"
        return
    fi
    
    if command_exists docker-compose; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        print_success "Docker Compose already installed (version $COMPOSE_VERSION)"
        return
    fi
    
    print_step "Installing Docker Compose..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get install -y docker-compose-plugin
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        if command_exists dnf; then
            sudo dnf install -y docker-compose-plugin
        else
            sudo yum install -y docker-compose-plugin
        fi
    elif [[ "$OS" == "macOS" ]]; then
        # Docker Compose comes with Docker Desktop on macOS
        print_info "Docker Compose comes with Docker Desktop on macOS"
    else
        # Install standalone Docker Compose
        COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
        sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    print_success "Docker Compose installed successfully"
}

# Install Node.js
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js $NODE_VERSION already installed"
            return
        else
            print_warning "Node.js version $NODE_VERSION is too old, upgrading to Node.js 18..."
        fi
    fi
    
    print_step "Installing Node.js 18..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Remove old Node.js
        sudo apt-get remove -y nodejs npm 2>/dev/null || true
        
        # Install Node.js 18 from NodeSource
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        # Remove old Node.js
        if command_exists dnf; then
            sudo dnf remove -y nodejs npm 2>/dev/null || true
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo dnf install -y nodejs
        else
            sudo yum remove -y nodejs npm 2>/dev/null || true
            curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
            sudo yum install -y nodejs
        fi
        
    elif [[ "$OS" == "macOS" ]]; then
        if command_exists brew; then
            brew install node@18
            brew link --overwrite node@18 --force
        else
            print_error "Homebrew not found. Please install Node.js 18 manually from https://nodejs.org"
            exit 1
        fi
    else
        print_error "Unsupported OS for automatic Node.js installation: $OS"
        print_info "Please install Node.js 18 manually from https://nodejs.org"
        exit 1
    fi
    
    # Verify installation
    if command_exists node && command_exists npm; then
        NODE_VERSION=$(node --version)
        NPM_VERSION=$(npm --version)
        print_success "Node.js $NODE_VERSION and npm $NPM_VERSION installed successfully"
    else
        print_error "Node.js installation failed"
        exit 1
    fi
}

# Install Git
install_git() {
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        print_success "Git already installed (version $GIT_VERSION)"
        return
    fi
    
    print_step "Installing Git..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get install -y git
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        if command_exists dnf; then
            sudo dnf install -y git
        else
            sudo yum install -y git
        fi
    elif [[ "$OS" == "macOS" ]]; then
        if command_exists brew; then
            brew install git
        else
            print_info "Git should be available via Xcode Command Line Tools"
            xcode-select --install 2>/dev/null || true
        fi
    fi
    
    print_success "Git installed successfully"
}

# Install additional utilities
install_utilities() {
    print_step "Installing additional utilities..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        sudo apt-get install -y curl wget unzip zip jq htop net-tools postgresql-client
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Fedora"* ]]; then
        if command_exists dnf; then
            sudo dnf install -y curl wget unzip zip jq htop net-tools postgresql
        else
            sudo yum install -y curl wget unzip zip jq htop net-tools postgresql
        fi
    elif [[ "$OS" == "macOS" ]]; then
        if command_exists brew; then
            brew install curl wget jq htop postgresql
        fi
    fi
    
    print_success "Additional utilities installed"
}

# Verify all installations
verify_installations() {
    print_step "Verifying all installations..."
    
    local all_good=true
    
    # Check Docker
    if command_exists docker; then
        if docker info >/dev/null 2>&1; then
            print_success "✅ Docker is installed and running"
        else
            print_error "❌ Docker is installed but not running"
            all_good=false
        fi
    else
        print_error "❌ Docker is not installed"
        all_good=false
    fi
    
    # Check Docker Compose
    if docker compose version >/dev/null 2>&1 || command_exists docker-compose; then
        print_success "✅ Docker Compose is installed"
    else
        print_error "❌ Docker Compose is not installed"
        all_good=false
    fi
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "✅ Node.js $NODE_VERSION is installed"
        else
            print_error "❌ Node.js version is too old ($NODE_VERSION < 18)"
            all_good=false
        fi
    else
        print_error "❌ Node.js is not installed"
        all_good=false
    fi
    
    # Check npm
    if command_exists npm; then
        print_success "✅ npm is installed"
    else
        print_error "❌ npm is not installed"
        all_good=false
    fi
    
    # Check Git
    if command_exists git; then
        print_success "✅ Git is installed"
    else
        print_warning "⚠️  Git is not installed (optional)"
    fi
    
    # Check curl
    if command_exists curl; then
        print_success "✅ curl is installed"
    else
        print_error "❌ curl is not installed"
        all_good=false
    fi
    
    if [ "$all_good" = true ]; then
        print_success "🎉 All prerequisites are installed and ready!"
        return 0
    else
        print_error "❌ Some prerequisites are missing or not working properly"
        return 1
    fi
}

# Configure system settings
configure_system() {
    print_step "Configuring system settings..."
    
    # Increase file limits for Docker
    if [[ "$OS" != "macOS" ]]; then
        echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null
        echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null
        echo "root soft nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null
        echo "root hard nofile 65536" | sudo tee -a /etc/security/limits.conf >/dev/null
    fi
    
    # Configure Docker daemon (if needed)
    if [[ "$OS" != "macOS" ]] && [ ! -f /etc/docker/daemon.json ]; then
        sudo mkdir -p /etc/docker
        sudo tee /etc/docker/daemon.json >/dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF
        sudo systemctl restart docker
    fi
    
    print_success "System configured"
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
    install_utilities
    configure_system
    
    # Verify installations
    echo ""
    print_header "Verification"
    if verify_installations; then
        echo ""
        print_header "🎉 PREREQUISITES INSTALLATION COMPLETE!"
        echo ""
        print_success "All prerequisites have been successfully installed!"
        echo ""
        print_info "Next steps:"
        echo "1. Run: ./complete-system-install.sh (to create the ISP system)"
        echo "2. Run: ./start-system.sh (to start all services)"
        echo ""
        print_info "If you're on Linux and just added to docker group:"
        echo "You may need to log out and back in, or run: newgrp docker"
        echo ""
        print_success "System is ready for ISP Management System installation!"
    else
        echo ""
        print_error "Prerequisites installation failed!"
        print_info "Please check the errors above and try again"
        exit 1
    fi
}

# Run main function
main "$@"
