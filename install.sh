#!/bin/bash

# ISP Management System Installation Script
# This script will install Node.js, dependencies, and set up the ISP system

set -e

echo "🚀 ISP Management System Installation Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    print_status "Detected Linux OS"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    print_status "Detected macOS"
else
    print_error "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Function to check Node.js version
check_nodejs() {
    print_status "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        print_warning "Node.js not found. Installing Node.js..."
        if [[ "$OS" == "linux" ]]; then
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [[ "$OS" == "macos" ]]; then
            # Check if Homebrew is installed
            if ! command -v brew &> /dev/null; then
                print_status "Installing Homebrew..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            fi
            brew install node@18
        fi
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ $NODE_VERSION -lt 18 ]]; then
            print_warning "Node.js version $NODE_VERSION detected. Upgrading to Node.js 18..."
            if [[ "$OS" == "linux" ]]; then
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif [[ "$OS" == "macos" ]]; then
                brew install node@18
            fi
        else
            print_success "Node.js $(node --version) is installed"
        fi
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    if command -v bun &> /dev/null; then
        print_status "Using Bun package manager..."
        bun install
    elif command -v yarn &> /dev/null; then
        print_status "Using Yarn package manager..."
        yarn install
    else
        print_status "Using npm package manager..."
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

# Function to build the application
build_application() {
    print_status "Building the application..."
    
    if command -v bun &> /dev/null; then
        bun run build
    elif command -v yarn &> /dev/null; then
        yarn build
    else
        npm run build
    fi
    
    print_success "Application built successfully"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not found in environment variables"
        print_status "Please ensure your Neon database is connected in Project Settings"
        print_status "The database will be initialized when you complete the setup at /setup"
    else
        print_success "Database connection configured"
    fi
}

# Function to start the development server
start_server() {
    print_status "Starting the ISP Management System..."
    
    echo ""
    echo "🎉 Installation Complete!"
    echo "========================"
    echo ""
    echo "To start the development server, run:"
    if command -v bun &> /dev/null; then
        echo "  bun dev"
    elif command -v yarn &> /dev/null; then
        echo "  yarn dev"
    else
        echo "  npm run dev"
    fi
    echo ""
    echo "Then visit: http://localhost:3000/setup"
    echo "Complete the initial setup to configure your ISP system"
    echo ""
    echo "⚠️  Make sure to:"
    echo "1. Connect your Neon database in Project Settings"
    echo "2. Complete the setup wizard at /setup"
    echo "3. Change default passwords in production"
}

# Main installation process
main() {
    print_status "Starting ISP Management System installation..."
    
    # Check Node.js version
    check_nodejs
    
    # Install dependencies
    install_dependencies
    
    # Build application
    build_application
    
    # Setup database
    setup_database
    
    # Show completion message
    start_server
}

# Run main function
main "$@"
