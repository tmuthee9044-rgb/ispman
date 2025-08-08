# ISP Management System - Complete Business Solution

A comprehensive Internet Service Provider (ISP) management system with automated deployment using Docker.

## 🚀 One-Command Installation

### The Easiest Way - Install Directly from GitHub:

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/tmuthee9044-rgb/ispman/main/install.sh | bash
\`\`\`

**That's it!** This single command will:
- ✅ Download the complete system from GitHub
- ✅ Install Docker and Docker Compose automatically
- ✅ Set up PostgreSQL database with complete schema
- ✅ Generate secure authentication secrets automatically
- ✅ Configure NEXTAUTH_URL based on your environment
- ✅ Insert realistic sample data for immediate testing
- ✅ Start all services (Web app, Database, Redis, Nginx)
- ✅ Configure networking and security
- ✅ Provide you with access URLs and credentials

### Alternative Installation Methods:

#### Method 1: Clone and Install
\`\`\`bash
git clone https://github.com/tmuthee9044-rgb/ispman.git
cd ispman
chmod +x setup.sh
./setup.sh
\`\`\`

#### Method 2: Download and Install
\`\`\`bash
wget https://github.com/tmuthee9044-rgb/ispman/archive/main.zip
unzip main.zip
cd ispman-main
chmod +x setup.sh
./setup.sh
\`\`\`

## 📋 Prerequisites

- **Operating System**: Linux (Ubuntu/Debian) or macOS
- **Memory**: At least 4GB RAM
- **Storage**: 10GB free disk space
- **Network**: Internet connection for downloading components
- **Permissions**: Non-root user with sudo access

## 🔧 Automatic Configuration

### NEXTAUTH_URL Generation
The setup script automatically configures the `NEXTAUTH_URL` based on your environment:

#### **Local Development (Default)**
\`\`\`bash
NEXTAUTH_URL=http://localhost:3000
\`\`\`

#### **Public Server**
If you're installing on a server with a public IP, the script will:
1. Detect your public IP address
2. Ask if you want to use it instead of localhost
3. Set `NEXTAUTH_URL=http://YOUR_PUBLIC_IP:3000`

#### **Custom Domain**
The script will ask if you have a custom domain:
1. Enter your domain (e.g., `isp.yourdomain.com`)
2. Choose HTTP or HTTPS
3. Set `NEXTAUTH_URL=https://isp.yourdomain.com`

### NEXTAUTH_SECRET Generation
The script automatically generates a cryptographically secure secret using:
1. **OpenSSL** (preferred): `openssl rand -hex 32`
2. **Python3** (fallback): `python3 -c "import secrets; print(secrets.token_hex(32))"`
3. **Node.js** (fallback): `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 🎯 After Installation (5-10 minutes)

### Access Your System
- **🌐 Web Interface**: Your configured NEXTAUTH_URL (default: http://localhost:3000)
- **🗄️ Database**: localhost:5432
- **📊 Admin Dashboard**: Your NEXTAUTH_URL/admin
- **🔧 System Health**: Your NEXTAUTH_URL/health

### Default Credentials
- **Database User**: `isp_user`
- **Database Password**: `isp_password_2024`
- **Database Name**: `isp_system`

### Sample Data Included
- ✅ **8 Customers** with complete profiles and contact information
- ✅ **8 Service Plans** ranging from KES 1,200 to KES 25,000
- ✅ **Company Information** with default ISP settings
- ✅ **Dashboard Statistics** with real-time data

## 🛠️ System Management

### Basic Commands
\`\`\`bash
# Stop the system
docker compose down

# Start the system
docker compose up -d

# View logs
docker compose logs -f

# Restart specific service
docker compose restart isp_app

# Check system status
docker compose ps
\`\`\`

### Update System
\`\`\`bash
# Pull latest changes from GitHub
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build
\`\`\`

### Environment Configuration
Your `.env` file contains all configuration:

\`\`\`bash
# Database Configuration
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system

# Application Configuration
NODE_ENV=production
NEXTAUTH_SECRET=automatically_generated_64_character_string
NEXTAUTH_URL=http://localhost:3000  # or your custom URL

# ISP Configuration
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
DEFAULT_CURRENCY=KES
\`\`\`

## 🌐 Production Deployment

### For Production Use:

1. **Use a Custom Domain**:
   \`\`\`bash
   NEXTAUTH_URL=https://isp.yourdomain.com
   \`\`\`

2. **Enable HTTPS**:
   - Obtain SSL certificates (Let's Encrypt recommended)
   - Place certificates in `./ssl/` directory
   - Update nginx configuration for HTTPS

3. **Change Default Passwords**:
   \`\`\`bash
   # Edit .env file
   POSTGRES_PASSWORD=your_secure_password_here
   \`\`\`

4. **Configure Firewall**:
   \`\`\`bash
   # Ubuntu/Debian
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw allow 22
   sudo ufw enable
   \`\`\`

### Domain Setup Examples:

#### **Subdomain Setup**
\`\`\`bash
# For isp.yourdomain.com
NEXTAUTH_URL=https://isp.yourdomain.com
\`\`\`

#### **Custom Port**
\`\`\`bash
# For custom port (e.g., 8080)
NEXTAUTH_URL=http://yourdomain.com:8080
\`\`\`

#### **Load Balancer**
\`\`\`bash
# Behind a load balancer
NEXTAUTH_URL=https://yourdomain.com
\`\`\`

## 📋 System Components

### Included Services
- **Next.js Application** - Modern React-based ISP management interface
- **PostgreSQL 15** - Primary database with full schema
- **Redis 7** - Caching and session storage
- **Nginx** - Reverse proxy and load balancer with security headers
- **Docker Compose** - Container orchestration

### Key Features Ready to Use
- 👥 **Customer Management** - Complete customer lifecycle management
- 💰 **Billing & Payments** - M-Pesa integration, automated invoicing
- 🌐 **Network Management** - Router monitoring, IP allocation, bandwidth management
- 🎫 **Support System** - Ticket management, knowledge base, live chat
- 📊 **Reports & Analytics** - Revenue reports, usage analytics, customer insights
- 👨‍💼 **HR Management** - Employee management, payroll, leave tracking
- 🚗 **Vehicle Management** - Fleet tracking, maintenance, fuel logs
- 📱 **Communication** - SMS integration, email notifications
- ⚙️ **System Configuration** - Company settings, service plans, automation
- 📝 **Comprehensive Logging** - Audit trails, system monitoring

## 🔒 Security Features

### Built-in Security
- ✅ **Automatic Secret Generation** - Cryptographically secure NEXTAUTH_SECRET
- ✅ **Environment-based URLs** - Automatic NEXTAUTH_URL configuration
- ✅ **Secure Headers** - XSS protection, CSRF prevention
- ✅ **Database Security** - Parameterized queries, connection pooling
- ✅ **Session Management** - Secure Redis-based sessions
- ✅ **Input Validation** - Server-side validation for all inputs
- ✅ **Audit Logging** - Complete audit trail of all actions

### Production Security Checklist
- [ ] Change default database password
- [ ] Verify NEXTAUTH_SECRET is secure (automatically generated)
- [ ] Configure SSL certificates for HTTPS
- [ ] Set up firewall rules (UFW/iptables)
- [ ] Enable automated backups
- [ ] Configure email notifications
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

## 🆘 Troubleshooting

### Common Issues and Solutions

#### Authentication Issues
\`\`\`bash
# Check NEXTAUTH_URL configuration
cat .env | grep NEXTAUTH_URL

# Verify it matches your access URL
# Local: http://localhost:3000
# Server: http://YOUR_IP:3000
# Domain: https://yourdomain.com
\`\`\`

#### Services Won't Start
\`\`\`bash
# Check system resources
docker system df
free -h
df -h

# Check logs
docker compose logs

# Restart everything
docker compose down
docker compose up -d
\`\`\`

#### Database Connection Issues
\`\`\`bash
# Test database connection
docker exec isp_postgres pg_isready -U isp_user

# Check database logs
docker compose logs postgres

# Reset database (WARNING: This deletes all data)
docker compose down
docker volume rm ispman_postgres_data
docker compose up -d
\`\`\`

#### URL Configuration Issues
\`\`\`bash
# Check current configuration
echo "NEXTAUTH_URL: $(grep NEXTAUTH_URL .env)"

# Update NEXTAUTH_URL manually
sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://yourdomain.com|' .env

# Restart application
docker compose restart isp_app
\`\`\`

### Getting Help
1. **Check logs first**: `docker compose logs -f`
2. **Verify system resources**: Ensure adequate RAM and disk space
3. **Test network connectivity**: Ensure ports are not blocked
4. **Check Docker status**: `docker system info`

## 📈 Scaling for Production

### High Availability Setup
1. **Load Balancer** - Multiple application instances
2. **Database Clustering** - PostgreSQL replication
3. **Redis Clustering** - Distributed session management
4. **CDN Integration** - Static asset delivery
5. **Monitoring Stack** - Prometheus + Grafana

### Performance Optimization
1. **Database Optimization** - Already includes optimized indexes
2. **Caching Strategy** - Redis + application-level caching
3. **Connection Pooling** - PgBouncer for database connections
4. **Asset Optimization** - Next.js built-in optimizations
5. **Background Jobs** - Queue processing for heavy tasks

## 🔄 Updates and Maintenance

### Automatic Updates
\`\`\`bash
# Create update script
cat > update.sh << 'EOF'
#!/bin/bash
echo "Updating ISP Management System..."
git pull origin main
docker compose down
docker compose up -d --build
echo "Update complete!"
EOF

chmod +x update.sh
./update.sh
\`\`\`

### Configuration Updates
\`\`\`bash
# Update NEXTAUTH_URL for production
sed -i 's|NEXTAUTH_URL=http://localhost:3000|NEXTAUTH_URL=https://yourdomain.com|' .env

# Restart to apply changes
docker compose restart isp_app
\`\`\`

## 📞 Support and Documentation

### Quick Links
- **Installation Issues**: Check the troubleshooting section above
- **Feature Requests**: Create an issue on GitHub
- **Bug Reports**: Use the GitHub issue tracker
- **Documentation**: See the `/docs` directory in the repository

### System Information
- **Version**: Latest from main branch
- **License**: MIT License
- **Requirements**: Docker 20.10+, Docker Compose 2.0+
- **Supported OS**: Linux (Ubuntu/Debian), macOS

---

## 🎉 Success!

Your ISP Management System is now ready with:
- ✅ **Automatic URL Configuration** - Works locally and in production
- ✅ **Secure Authentication** - Auto-generated secrets
- ✅ **Complete Database** - Ready with sample data
- ✅ **Professional Interface** - Modern React-based UI
- ✅ **Production Ready** - Scalable and secure

**Happy managing! 🚀**

For the latest updates and features, star the repository and watch for releases.

---

**Repository**: https://github.com/tmuthee9044-rgb/ispman
**Author**: Taku (tmuthee9044-rgb)
**License**: MIT
