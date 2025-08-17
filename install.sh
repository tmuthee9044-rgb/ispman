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
        print_warning "Node.js not found. Installing Node.js 20..."
        install_nodejs
    else
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
        
        if [[ $MAJOR_VERSION -lt 20 ]]; then
            print_warning "Node.js version $NODE_VERSION detected. This system requires Node.js 20+ for compatibility with @neondatabase/serverless"
            print_status "Upgrading to Node.js 20..."
            install_nodejs
        else
            print_success "Node.js $NODE_VERSION is installed and compatible"
        fi
    fi
}

# Function to install Node.js 20
install_nodejs() {
    if [[ "$OS" == "linux" ]]; then
        print_status "Installing Node.js 20 via NodeSource repository..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [[ "$OS" == "macos" ]]; then
        # Check if Homebrew is installed
        if ! command -v brew &> /dev/null; then
            print_status "Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        print_status "Installing Node.js 20 via Homebrew..."
        brew install node@20
        brew link --overwrite node@20
    fi
    
    # Verify installation
    if command -v node &> /dev/null; then
        print_success "Node.js $(node --version) installed successfully"
    else
        print_error "Failed to install Node.js. Please install manually from https://nodejs.org"
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Check if we have write permissions to the current directory
    if [ ! -w "." ]; then
        print_error "No write permission in current directory. Please run from a directory you own."
        print_status "Try: cd ~ && git clone <repository> && cd <project>"
        exit 1
    fi
    
    # Fix ownership if needed (common issue when cloning as different user)
    if [ -d "node_modules" ] && [ ! -w "node_modules" ]; then
        print_status "Fixing node_modules permissions..."
        sudo chown -R $USER:$USER node_modules 2>/dev/null || true
    fi
    
    # Clear npm cache if there are permission issues
    npm cache clean --force 2>/dev/null || true
    
    # Install dependencies with error handling
    if command -v bun &> /dev/null; then
        print_status "Using Bun package manager..."
        if ! bun install; then
            print_error "Bun installation failed. Falling back to npm..."
            npm install
        fi
    elif command -v yarn &> /dev/null; then
        print_status "Using Yarn package manager..."
        if ! yarn install; then
            print_error "Yarn installation failed. Falling back to npm..."
            npm install
        fi
    else
        print_status "Using npm package manager..."
        if ! npm install; then
            print_error "npm install failed. Trying with --no-optional flag..."
            npm install --no-optional
        fi
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
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root directory."
        exit 1
    fi
    
    # Check Node.js version
    check_nodejs
    
    # Install dependencies with error handling
    if ! install_dependencies; then
        print_error "Failed to install dependencies. Please check the error messages above."
        print_status "You can try running 'npm install' manually after fixing any issues."
        exit 1
    fi
    
    # Build application
    if ! build_application; then
        print_warning "Build failed, but you can still run in development mode"
    fi
    
    # Setup database
    setup_database
    
    # Show completion message
    start_server
}

# Run main function
main "$@"
