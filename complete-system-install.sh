#!/bin/bash

# ISP Management System - Complete Installation Script
# This script creates and configures the entire ISP management system

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Installing ISP Management System${NC}"
echo "=================================="

# Check if Docker is available
if ! command -v docker >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker not found. Please run install-prerequisites.sh first${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Starting Docker service...${NC}"
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start docker
    else
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again${NC}"
        exit 1
    fi
fi

# Create project directory
PROJECT_DIR="isp-management-system"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Directory $PROJECT_DIR already exists. Backing up...${NC}"
    mv "$PROJECT_DIR" "${PROJECT_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo -e "${BLUE}📁 Created project directory: $PROJECT_DIR${NC}"

# Generate environment file
echo -e "${BLUE}🔧 Creating environment configuration...${NC}"
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://isp_user:isp_password_2024@localhost:5432/isp_system
POSTGRES_HOST=postgres
POSTGRES_USER=isp_user
POSTGRES_PASSWORD=isp_password_2024
POSTGRES_DATABASE=isp_system
POSTGRES_PORT=5432

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-2024
NEXTAUTH_URL=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Company Settings
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+1-234-567-8900
EOF

# Create improved Docker Compose configuration
echo -e "${BLUE}🐳 Creating Docker Compose configuration...${NC}"
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: isp_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: isp_system
      POSTGRES_USER: isp_user
      POSTGRES_PASSWORD: isp_password_2024
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
    networks:
      - isp_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U isp_user -d isp_system"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis for caching and sessions
  redis:
    image: redis:7-alpine
    container_name: isp_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - isp_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3

  # ISP Management Application
  isp_app:
    build: .
    container_name: isp_management
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system
      - POSTGRES_HOST=postgres
      - POSTGRES_USER=isp_user
      - POSTGRES_PASSWORD=isp_password_2024
      - POSTGRES_DATABASE=isp_system
      - POSTGRES_PORT=5432
      - NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-2024
      - NEXTAUTH_URL=http://localhost:3000
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - isp_network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:

networks:
  isp_network:
    driver: bridge
EOF

# Create Dockerfile
echo -e "${BLUE}🐳 Creating Dockerfile...${NC}"
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
EOF

# Create package.json
echo -e "${BLUE}📦 Creating package.json...${NC}"
cat > package.json << 'EOF'
{
  "name": "isp-management-system",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "pg": "^8.11.3",
    "@types/pg": "^8.10.7",
    "bcryptjs": "^2.4.3",
    "@types/bcryptjs": "^2.4.4",
    "jsonwebtoken": "^9.0.2",
    "@types/jsonwebtoken": "^9.0.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.292.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}
EOF

# Create health check API route
echo -e "${BLUE}🏥 Creating health check endpoint...${NC}"
mkdir -p app/api/health
cat > app/api/health/route.ts << 'EOF'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development"
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: "unhealthy", 
        error: "Health check failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
EOF

# Create startup script
echo -e "${BLUE}🚀 Creating startup script...${NC}"
cat > start-system.sh << 'EOF'
#!/bin/bash

# ISP Management System Startup Script

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting ISP Management System...${NC}"

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Stop any existing containers
echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
docker compose down --remove-orphans || true

# Build and start services
echo -e "${BLUE}🏗️  Building and starting services...${NC}"
docker compose up -d --build

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to start...${NC}"

# Wait for PostgreSQL
echo -n "Waiting for PostgreSQL"
while ! docker exec isp_postgres pg_isready -U isp_user -d isp_system >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✅${NC}"

# Wait for Redis
echo -n "Waiting for Redis"
while ! docker exec isp_redis redis-cli ping >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo -e " ${GREEN}✅${NC}"

# Wait for Application
echo -n "Waiting for Application"
for i in {1..30}; do
    if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
        echo -e " ${GREEN}✅${NC}"
        break
    fi
    echo -n "."
    sleep 3
    if [ $i -eq 30 ]; then
        echo -e " ${YELLOW}⚠️  Application may still be starting${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 ISP Management System is running!${NC}"
echo ""
echo -e "${BLUE}🌐 Access Points:${NC}"
echo "   • Web Interface: http://localhost:3000"
echo "   • Health Check: http://localhost:3000/api/health"
echo "   • Database: localhost:5432"
echo "   • Redis: localhost:6379"
echo ""
echo -e "${BLUE}🛠️  Management Commands:${NC}"
echo "   • View logs: docker compose logs -f"
echo "   • Stop system: docker compose down"
echo "   • Restart: docker compose restart"
echo "   • View status: docker compose ps"
echo ""
echo -e "${YELLOW}📝 Note: Use HTTP (not HTTPS) to access the system${NC}"
EOF

chmod +x start-system.sh

# Create troubleshooting script
echo -e "${BLUE}🔧 Creating troubleshooting script...${NC}"
cat > troubleshoot.sh << 'EOF'
#!/bin/bash

# ISP Management System Troubleshooting Script

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 ISP Management System Troubleshooting${NC}"
echo "========================================"

# Check Docker
echo -e "${BLUE}🐳 Docker Status:${NC}"
if docker info >/dev/null 2>&1; then
    echo -e "   ${GREEN}✅ Docker is running${NC}"
    echo "   Docker version: $(docker --version)"
else
    echo -e "   ${RED}❌ Docker is not running${NC}"
    echo "   Please start Docker and try again"
fi

echo ""

# Check containers
echo -e "${BLUE}📦 Container Status:${NC}"
docker compose ps

echo ""

# Check logs
echo -e "${BLUE}📋 Recent Logs:${NC}"
echo "Application logs:"
docker compose logs --tail=10 isp_app

echo ""
echo "Database logs:"
docker compose logs --tail=5 postgres

echo ""

# Check ports
echo -e "${BLUE}🔌 Port Status:${NC}"
if command -v netstat >/dev/null 2>&1; then
    echo "Listening ports:"
    netstat -tlnp | grep -E ':(3000|5432|6379)'
elif command -v ss >/dev/null 2>&1; then
    echo "Listening ports:"
    ss -tlnp | grep -E ':(3000|5432|6379)'
else
    echo "Port checking tools not available"
fi

echo ""

# Test connectivity
echo -e "${BLUE}🌐 Connectivity Tests:${NC}"
echo -n "Testing application health: "
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Healthy${NC}"
else
    echo -e "${RED}❌ Not responding${NC}"
fi

echo -n "Testing database connection: "
if docker exec isp_postgres pg_isready -U isp_user -d isp_system >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Not connected${NC}"
fi

echo -n "Testing Redis connection: "
if docker exec isp_redis redis-cli ping >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Connected${NC}"
else
    echo -e "${RED}❌ Not connected${NC}"
fi

echo ""
echo -e "${BLUE}💡 Common Solutions:${NC}"
echo "1. Restart the system: ./start-system.sh"
echo "2. Check Docker is running: docker info"
echo "3. View detailed logs: docker compose logs -f"
echo "4. Reset everything: docker compose down && docker compose up -d --build"
echo "5. Access via HTTP: http://localhost:3000 (not HTTPS)"
EOF

chmod +x troubleshoot.sh

echo ""
echo -e "${GREEN}✅ ISP Management System installation completed!${NC}"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Run: ./start-system.sh"
echo "2. Wait for all services to start (about 2-3 minutes)"
echo "3. Access: http://localhost:3000"
echo ""
echo -e "${BLUE}🛠️  Available Scripts:${NC}"
echo "   • ./start-system.sh - Start the system"
echo "   • ./troubleshoot.sh - Diagnose issues"
echo "   • docker compose logs -f - View live logs"
echo ""
echo -e "${YELLOW}⚠️  Important: Use HTTP (http://localhost:3000) not HTTPS${NC}"
