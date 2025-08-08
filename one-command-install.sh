#!/bin/bash

# ISP Management System - One Command Installation
# This script installs prerequisites and the complete system

set -e

echo "🚀 ISP Management System - One Command Installation"
echo "=================================================="

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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

print_step "Step 1: Installing Prerequisites"
if [ -f "install-prerequisites.sh" ]; then
    chmod +x install-prerequisites.sh
    ./install-prerequisites.sh
else
    print_error "install-prerequisites.sh not found!"
    exit 1
fi

print_step "Step 2: Applying Docker group changes"
print_warning "Applying Docker group changes..."
newgrp docker << 'EOF'
print_step "Step 3: Installing Complete System"
if [ -f "complete-system-install.sh" ]; then
    chmod +x complete-system-install.sh
    ./complete-system-install.sh
else
    print_error "complete-system-install.sh not found!"
    exit 1
fi
EOF

print_status "🎉 Installation completed successfully!"
echo ""
echo "🌐 Your ISP Management System is now running at: http://localhost:3000"
echo ""
echo "Next steps:"
echo "1. Open your browser and go to http://localhost:3000"
echo "2. Login with: admin@isp.com / admin123"
echo "3. Start managing your ISP operations!"
