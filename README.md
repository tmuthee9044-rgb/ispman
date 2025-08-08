# ISP Management System

A complete Internet Service Provider (ISP) management system built with Next.js 14, PostgreSQL 15, Redis 7, and Nginx. This system provides comprehensive tools for managing customers, billing, network equipment, support tickets, and business analytics.

## 🚀 One-Command Installation

Get your complete ISP management system running in minutes:

\`\`\`bash
# Download and run the complete installation
curl -fsSL https://raw.githubusercontent.com/yourusername/isp-system/main/one-command-install.sh | bash

# Or if you have the files locally:
chmod +x one-command-install.sh
./one-command-install.sh
\`\`\`

This single command will:
- ✅ Install all prerequisites (Docker, Node.js, Git, utilities)
- ✅ Create the complete ISP management application
- ✅ Set up PostgreSQL 15 database with sample data
- ✅ Configure Redis 7 for caching and sessions
- ✅ Set up Nginx reverse proxy with security headers
- ✅ Generate secure authentication secrets
- ✅ Create 50+ sample customers and realistic data

## 📋 System Requirements

### Automatic Installation (Recommended)
The installation script automatically installs all prerequisites:

- **Operating System**: Ubuntu 18.04+, Debian 10+, CentOS 7+, macOS 10.15+
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 10GB free space minimum
- **Network**: Internet connection for downloading packages

### Manual Prerequisites (if needed)
- Docker 20.10+ and Docker Compose
- Node.js 18+ and npm
- Git
- curl and basic system utilities

## 🎯 Quick Start

### 1. Install Everything
\`\`\`bash
./one-command-install.sh
\`\`\`

### 2. Start the System
\`\`\`bash
./start-system.sh
\`\`\`

### 3. Access Your ISP System
- **Main Dashboard**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## 🏗️ System Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    Next.js      │    │   PostgreSQL    │
│  Reverse Proxy  │────│   Application   │────│    Database     │
│   Port: 80      │    │   Port: 3000    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │     Redis       │
                       │     Cache       │
                       │   Port: 6379    │
                       └─────────────────┘
\`\`\`

## 📊 Features

### 🏢 Customer Management
- Complete customer database with profiles
- Individual and business customer types
- Service assignment and tracking
- Customer portal access
- Import/export capabilities

### 💰 Billing & Payments
- Automated billing cycles
- M-Pesa payment integration
- Invoice generation and tracking
- Payment history and reporting
- Overdue account management

### 🌐 Network Management
- Equipment monitoring and status
- IP address allocation
- Network performance tracking
- Uptime monitoring
- Equipment maintenance logs

### 🎫 Support System
- Ticket management system
- Priority-based support queues
- Knowledge base integration
- Customer communication tools
- Performance analytics

### 📈 Analytics & Reporting
- Revenue and financial reports
- Customer growth analytics
- Network performance metrics
- Service plan comparisons
- Business intelligence dashboard

### ⚙️ System Administration
- User management and roles
- Company settings and branding
- Backup and restore tools
- System health monitoring
- Audit logs and security

## 📦 Sample Data Included

The system comes pre-loaded with realistic sample data:

- **10 Customers**: Mix of individual and business accounts
- **8 Service Plans**: From basic (KES 1,200) to enterprise (KES 35,000)
- **Payment Records**: M-Pesa and bank transfer history
- **Network Equipment**: Routers, switches, and access points
- **Support Tickets**: Various priority levels and categories
- **System Logs**: Comprehensive audit trail

## 🛠️ Management Commands

### System Control
\`\`\`bash
# Start all services
./start-system.sh

# Stop all services
docker compose down

# Restart services
docker compose restart

# View service status
docker compose ps

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f isp_app
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f nginx
\`\`\`

### Database Management
\`\`\`bash
# Connect to database
psql -h localhost -U isp_user -d isp_system

# Backup database
docker compose exec postgres pg_dump -U isp_user isp_system > backup.sql

# Restore database
docker compose exec -T postgres psql -U isp_user isp_system < backup.sql
\`\`\`

### System Monitoring
\`\`\`bash
# Check system health
curl http://localhost:3000/api/health

# Monitor resource usage
docker stats

# View Nginx access logs
docker compose logs nginx | grep "GET\|POST"
\`\`\`

## 🔧 Configuration

### Environment Variables
Key configuration options in `.env`:

\`\`\`bash
# Database
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system

# Authentication
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000

# Company Settings
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
COMPANY_PHONE=+254700000000

# M-Pesa Integration (Optional)
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_BUSINESS_SHORT_CODE=174379
\`\`\`

### Service Ports
- **Web Interface**: http://localhost:3000
- **Nginx Proxy**: http://localhost:80
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🔒 Security Features

- **Rate Limiting**: API and login endpoint protection
- **Security Headers**: XSS, CSRF, and content security policies
- **Authentication**: Secure session management
- **Database Security**: Encrypted connections and user isolation
- **Network Security**: Docker network isolation
- **Audit Logging**: Comprehensive system activity tracking

## 📱 Mobile Responsive

The system is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🌍 Localization

Currently supports:
- English (default)
- Kenyan Shilling (KES) currency
- East Africa timezone (Africa/Nairobi)

## 🔄 Updates and Maintenance

### System Updates
\`\`\`bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose down
docker compose up -d --build
\`\`\`

### Database Maintenance
\`\`\`bash
# Run database maintenance
docker compose exec postgres psql -U isp_user -d isp_system -c "VACUUM ANALYZE;"

# Check database size
docker compose exec postgres psql -U isp_user -d isp_system -c "SELECT pg_size_pretty(pg_database_size('isp_system'));"
\`\`\`

## 🆘 Troubleshooting

### Common Issues

**Docker not starting:**
\`\`\`bash
# Check Docker status
sudo systemctl status docker

# Start Docker
sudo systemctl start docker
\`\`\`

**Port conflicts:**
\`\`\`bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
\`\`\`

**Database connection issues:**
\`\`\`bash
# Check PostgreSQL logs
docker compose logs postgres

# Restart database
docker compose restart postgres
\`\`\`

**Application not loading:**
\`\`\`bash
# Check application logs
docker compose logs isp_app

# Rebuild application
docker compose up -d --build isp_app
\`\`\`

### Health Checks
\`\`\`bash
# Check all services
curl http://localhost:3000/api/health

# Check individual services
docker compose ps
docker stats
\`\`\`

## 📞 Support

For support and questions:
- Check the logs: `docker compose logs -f`
- Review the troubleshooting section above
- Check system health: `curl http://localhost:3000/api/health`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎉 Acknowledgments

- Built with Next.js 14 and React 18
- Database powered by PostgreSQL 15
- Caching with Redis 7
- Reverse proxy with Nginx
- UI components from Radix UI
- Styling with Tailwind CSS
- Icons from Lucide React

---

**Ready to manage your ISP business efficiently!** 🚀
