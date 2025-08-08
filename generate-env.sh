#!/bin/bash

# Quick Environment Generator for ISP Management System
# This script generates NEXTAUTH_SECRET and NEXTAUTH_URL quickly

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

print_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_header "Quick Environment Configuration Generator"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Generate NEXTAUTH_SECRET
print_step "Generating NEXTAUTH_SECRET..."
if command_exists openssl; then
    NEXTAUTH_SECRET=$(openssl rand -hex 32)
    print_success "Generated using OpenSSL"
elif command_exists python3; then
    NEXTAUTH_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    print_success "Generated using Python3"
elif command_exists node; then
    NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    print_success "Generated using Node.js"
else
    NEXTAUTH_SECRET="isp-secret-$(date +%s)-$(whoami)-$(hostname | tr '.' '-')"
    print_success "Generated using fallback method"
fi

# Generate NEXTAUTH_URL
print_step "Configuring NEXTAUTH_URL..."
NEXTAUTH_URL="http://localhost:3000"

# Try to detect public IP
if command_exists curl; then
    PUBLIC_IP=$(curl -s --connect-timeout 5 ifconfig.me 2>/dev/null || echo "")
    if [[ -n "$PUBLIC_IP" && "$PUBLIC_IP" != "127.0.0.1" ]]; then
        print_info "Detected public IP: $PUBLIC_IP"
        echo "Available options:"
        echo "1) Use localhost (recommended for development): http://localhost:3000"
        echo "2) Use public IP: http://$PUBLIC_IP:3000"
        echo "3) Use custom domain"
        read -p "Choose option (1-3) [default: 1]: " choice
        
        case $choice in
            2)
                NEXTAUTH_URL="http://$PUBLIC_IP:3000"
                print_success "Using public IP: $NEXTAUTH_URL"
                ;;
            3)
                read -p "Enter your domain (e.g., isp.yourdomain.com): " CUSTOM_DOMAIN
                if [[ -n "$CUSTOM_DOMAIN" ]]; then
                    read -p "Use HTTPS? (y/N): " use_https
                    if [[ $use_https =~ ^[Yy]$ ]]; then
                        NEXTAUTH_URL="https://$CUSTOM_DOMAIN"
                    else
                        NEXTAUTH_URL="http://$CUSTOM_DOMAIN"
                    fi
                    print_success "Using custom domain: $NEXTAUTH_URL"
                fi
                ;;
            *)
                print_success "Using localhost: $NEXTAUTH_URL"
                ;;
        esac
    fi
fi

# Create .env file
print_step "Creating .env file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
POSTGRES_HOST=postgres
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
POSTGRES_PORT=5432

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${NEXTAUTH_URL}

# ISP Configuration
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+254700000000
DEFAULT_CURRENCY=KES
DEFAULT_TIMEZONE=Africa/Nairobi

# M-Pesa Configuration (Optional)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_mpesa_passkey

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EOF

print_success ".env file created successfully!"

print_header "Generated Configuration"
echo ""
print_info "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:16}... (64 characters total)"
print_info "NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""
print_success "Configuration saved to .env file"
echo ""
print_info "You can now run: docker compose up -d --build"
