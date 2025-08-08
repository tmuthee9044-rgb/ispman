#!/bin/bash

# ISP Management System - Prerequisites Installation Script
# This script installs all required dependencies for the ISP system

set -e

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
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    if [ -f /etc/debian_version ]; then
        DISTRO="debian"
    elif [ -f /etc/redhat-release ]; then
        DISTRO="redhat"
    else
        DISTRO="unknown"
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    OS="unknown"
fi

print_status "Detected OS: $OS"

# Update system packages
print_header "Updating system packages..."
if [[ "$OS" == "linux" ]]; then
    if [[ "$DISTRO" == "debian" ]]; then
        sudo apt update && sudo apt upgrade -y
        sudo apt install -y curl wget git software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    elif [[ "$DISTRO" == "redhat" ]]; then
        sudo yum update -y
        sudo yum install -y curl wget git
    fi
elif [[ "$OS" == "macos" ]]; then
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        print_status "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    brew update
fi

# Install Docker
print_header "Installing Docker..."
if ! command -v docker &> /dev/null; then
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            # Add Docker's official GPG key
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            
            # Add Docker repository
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            # Install Docker
            sudo apt update
            sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        elif [[ "$DISTRO" == "redhat" ]]; then
            sudo yum install -y yum-utils
            sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        fi
        
        # Add user to docker group
        sudo usermod -aG docker $USER
        
        # Start Docker service
        sudo systemctl start docker
        sudo systemctl enable docker
        
    elif [[ "$OS" == "macos" ]]; then
        print_status "Please install Docker Desktop for Mac from: https://docs.docker.com/desktop/mac/install/"
        print_warning "After installation, please restart this script"
        exit 1
    fi
else
    print_status "Docker is already installed"
fi

# Install Docker Compose (if not already installed with Docker)
print_header "Checking Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    if [[ "$OS" == "linux" ]]; then
        # Install Docker Compose
        DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
        sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
else
    print_status "Docker Compose is already available"
fi

# Install Node.js and npm
print_header "Installing Node.js..."
if ! command -v node &> /dev/null; then
    if [[ "$OS" == "linux" ]]; then
        # Install Node.js 20.x
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt install -y nodejs
        elif [[ "$DISTRO" == "redhat" ]]; then
            sudo yum install -y nodejs npm
        fi
    elif [[ "$OS" == "macos" ]]; then
        brew install node
    fi
else
    print_status "Node.js is already installed ($(node --version))"
fi

# Install Git (if not already installed)
print_header "Checking Git installation..."
if ! command -v git &> /dev/null; then
    if [[ "$OS" == "linux" ]]; then
        if [[ "$DISTRO" == "debian" ]]; then
            sudo apt install -y git
        elif [[ "$DISTRO" == "redhat" ]]; then
            sudo yum install -y git
        fi
    elif [[ "$OS" == "macos" ]]; then
        brew install git
    fi
else
    print_status "Git is already installed ($(git --version))"
fi

# Install additional tools
print_header "Installing additional tools..."
if [[ "$OS" == "linux" ]]; then
    if [[ "$DISTRO" == "debian" ]]; then
        sudo apt install -y htop tree jq unzip
    elif [[ "$DISTRO" == "redhat" ]]; then
        sudo yum install -y htop tree jq unzip
    fi
elif [[ "$OS" == "macos" ]]; then
    brew install htop tree jq
fi

# Verify installations
print_header "Verifying installations..."
echo "Checking installed versions:"

if command -v docker &> /dev/null; then
    echo "✅ Docker: $(docker --version)"
else
    echo "❌ Docker: Not installed"
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    if command -v docker-compose &> /dev/null; then
        echo "✅ Docker Compose: $(docker-compose --version)"
    else
        echo "✅ Docker Compose: $(docker compose version)"
    fi
else
    echo "❌ Docker Compose: Not installed"
fi

if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js: Not installed"
fi

if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm: Not installed"
fi

if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git: Not installed"
fi

# Check if user needs to log out and back in for Docker group
if [[ "$OS" == "linux" ]] && ! groups $USER | grep -q docker; then
    print_warning "You need to log out and back in (or restart) for Docker group changes to take effect"
    print_warning "Alternatively, you can run: newgrp docker"
fi

print_status "Prerequisites installation completed!"
print_status "You can now run the complete system installation script."

echo ""
echo "🎉 Prerequisites Installation Complete!"
echo "======================================"
echo "Next steps:"
echo "1. If on Linux, log out and back in (or run 'newgrp docker')"
echo "2. Run: ./complete-system-install.sh"
echo ""
