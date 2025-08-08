#!/bin/bash

# ISP Management System - Complete Installation Script
# This script creates and starts the complete ISP management system

set -e

echo "🚀 Installing Complete ISP Management System..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is running
print_header "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Create project directory if it doesn't exist
PROJECT_DIR="isp-management-system"
if [ ! -d "$PROJECT_DIR" ]; then
    print_status "Project directory already exists, using current directory"
fi

# Stop any existing containers
print_header "Stopping any existing containers..."
docker compose down 2>/dev/null || true

# Remove old containers and images to ensure clean start
print_header "Cleaning up old containers and images..."
docker system prune -f

# Create environment file
print_header "Creating environment configuration..."
cat > .env << EOF
# Database Configuration
POSTGRES_DB=isp_management
POSTGRES_USER=isp_admin
POSTGRES_PASSWORD=secure_password_2024
DATABASE_URL=postgresql://isp_admin:secure_password_2024@postgres:5432/isp_management

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://redis:6379

# Application Configuration
NODE_ENV=production
PORT=3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Company Configuration
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+1234567890
EOF

print_status "Environment file created"

# Build and start the application
print_header "Building and starting the ISP Management System..."
print_status "This may take several minutes on first run..."

# Build the application
docker compose build --no-cache

# Start the services
docker compose up -d

# Wait for services to be ready
print_header "Waiting for services to start..."
sleep 30

# Check if services are running
print_header "Checking service status..."
docker compose ps

# Wait for database to be ready
print_status "Waiting for database to be ready..."
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U isp_admin -d isp_management > /dev/null 2>&1; then
        print_status "Database is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Database failed to start within 5 minutes"
        exit 1
    fi
    sleep 10
done

# Run database migrations
print_header "Setting up database..."
print_status "Running database initialization scripts..."

# Execute all SQL scripts in order
for script in scripts/*.sql; do
    if [ -f "$script" ]; then
        print_status "Executing $(basename "$script")..."
        docker compose exec -T postgres psql -U isp_admin -d isp_management -f "/docker-entrypoint-initdb.d/$(basename "$script")" || true
    fi
done

# Check application health
print_header "Checking application health..."
sleep 10

# Test if the application is responding
for i in {1..12}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_status "Application is responding!"
        break
    fi
    if [ $i -eq 12 ]; then
        print_warning "Application may still be starting up"
    fi
    sleep 5
done

# Display final status
print_header "Installation Summary"
echo ""
echo "🎉 ISP Management System Installation Complete!"
echo "=============================================="
echo ""
echo "📊 System Status:"
docker compose ps
echo ""
echo "🌐 Access URLs:"
echo "   • Main Application: http://localhost:3000"
echo "   • Customer Portal:  http://localhost:3000/portal"
echo "   • Admin Dashboard:  http://localhost:3000/overview"
echo ""
echo "🔧 Default Login Credentials:"
echo "   • Username: admin@yourisp.com"
echo "   • Password: admin123"
echo ""
echo "📁 Important Files:"
echo "   • Environment: .env"
echo "   • Logs: docker compose logs -f"
echo "   • Database: PostgreSQL on port 5432"
echo ""
echo "🛠️ Management Commands:"
echo "   • Start system:  docker compose up -d"
echo "   • Stop system:   docker compose down"
echo "   • View logs:     docker compose logs -f"
echo "   • Restart:       docker compose restart"
echo ""
echo "📚 Documentation:"
echo "   • Quick Start: ./QUICK_START.md"
echo "   • Troubleshoot: ./troubleshoot.sh"
echo ""

# Create a simple status check script
cat > status.sh << 'EOF'
#!/bin/bash
echo "ISP Management System Status"
echo "============================"
echo ""
echo "Docker Containers:"
docker compose ps
echo ""
echo "System Resources:"
docker stats --no-stream
echo ""
echo "Application Logs (last 20 lines):"
docker compose logs --tail=20 app
EOF

chmod +x status.sh

print_status "Installation completed successfully!"
print_status "Run './status.sh' to check system status anytime"
print_warning "Please change default passwords before production use!"

echo ""
echo "🚀 Your ISP Management System is now running at: http://localhost:3000"
echo ""
