# ISP Management System - Quick Start Guide

## 🚀 One-Command Installation

The easiest way to get your ISP Management System running:

\`\`\`bash
curl -fsSL https://raw.githubusercontent.com/yourusername/isp-system/main/setup.sh | bash
\`\`\`

Or download and run locally:

\`\`\`bash
wget https://raw.githubusercontent.com/yourusername/isp-system/main/setup.sh
chmod +x setup.sh
./setup.sh
\`\`\`

## ⚡ What This Does

The setup script automatically:

1. **Detects your OS** (Linux/macOS)
2. **Installs Docker** and Docker Compose if needed
3. **Downloads** all required components
4. **Creates** database with complete schema
5. **Inserts** sample data for immediate testing
6. **Starts** all services
7. **Configures** networking and security

## 🎯 After Installation

### Access Your System
- **Web Interface**: http://localhost:3000
- **Database**: localhost:5432 (user: `isp_user`, password: `isp_password_2024`)

### Sample Data Included
- ✅ 8 customers with different service plans
- ✅ 8 service plans (Basic to Enterprise)
- ✅ Network routers and monitoring
- ✅ Equipment inventory
- ✅ Payment history and invoices
- ✅ Support tickets

### Key Features Ready to Use
- 👥 **Customer Management** - Add, edit, view customer details
- 💰 **Billing & Payments** - M-Pesa integration, invoice generation
- 🌐 **Network Management** - Router monitoring, IP allocation
- 🎫 **Support System** - Ticket management, knowledge base
- 📊 **Reports & Analytics** - Revenue, usage, customer reports
- ⚙️ **System Settings** - Company profile, service plans

## 🛠️ Management Commands

\`\`\`bash
# Stop the system
docker compose down

# Start the system
docker compose up -d

# View logs
docker compose logs -f

# Restart specific service
docker compose restart isp_app

# Update system
docker compose pull
docker compose up -d --build

# Database backup
docker exec isp_postgres pg_dump -U isp_user isp_system > backup.sql

# Database restore
docker exec -i isp_postgres psql -U isp_user isp_system < backup.sql
\`\`\`

## 🔧 Configuration

### Environment Variables (.env)
\`\`\`bash
# Database
DATABASE_URL=postgresql://isp_user:isp_password_2024@postgres:5432/isp_system

# Application
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Company Settings
COMPANY_NAME=Your ISP Company
COMPANY_EMAIL=admin@yourisp.com
DEFAULT_CURRENCY=KES
\`\`\`

### Port Configuration
- `3000` - Web interface
- `5432` - PostgreSQL database
- `6379` - Redis cache
- `80/443` - Nginx proxy

## 🔒 Security Checklist

For production deployment:

- [ ] Change default database password
- [ ] Update `NEXTAUTH_SECRET` with secure random string
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable database backups
- [ ] Configure email notifications
- [ ] Set up monitoring and alerts

## 🆘 Troubleshooting

### Services Won't Start
\`\`\`bash
# Check system resources
docker system df
free -h

# Check logs
docker compose logs

# Restart everything
docker compose down
docker compose up -d
\`\`\`

### Database Connection Issues
\`\`\`bash
# Test database connection
docker exec isp_postgres pg_isready -U isp_user

# Reset database
docker compose down
docker volume rm isp-system_postgres_data
docker compose up -d
\`\`\`

### Port Conflicts
\`\`\`bash
# Check what's using ports
sudo netstat -tulpn | grep :3000
sudo lsof -i :3000

# Change ports in docker-compose.yml if needed
\`\`\`

## 📈 Scaling for Production

### High Availability Setup
1. **Load Balancer** - Multiple app instances
2. **Database Clustering** - PostgreSQL replication
3. **Redis Clustering** - Session management
4. **CDN Integration** - Static asset delivery
5. **Monitoring** - Prometheus + Grafana

### Performance Optimization
1. **Database Indexing** - Already optimized
2. **Caching Strategy** - Redis + application cache
3. **Connection Pooling** - PgBouncer
4. **Asset Optimization** - Next.js built-in
5. **Background Jobs** - Queue processing

## 🔄 Updates and Maintenance

### Automatic Updates
\`\`\`bash
# Create update script
cat > update.sh << 'EOF'
#!/bin/bash
docker compose pull
docker compose up -d --build
docker exec isp_postgres psql -U isp_user -d isp_system -c "SELECT run_maintenance();"
EOF

chmod +x update.sh
./update.sh
\`\`\`

### Database Maintenance
\`\`\`bash
# Run maintenance (cleanup logs, update stats)
docker exec isp_postgres psql -U isp_user -d isp_system -c "SELECT run_maintenance();"

# Health check
docker exec isp_postgres psql -U isp_user -d isp_system -c "SELECT * FROM check_database_health();"

# Generate summary report
docker exec isp_postgres psql -U isp_user -d isp_system -c "SELECT * FROM generate_database_summary();"
\`\`\`

## 📞 Support

### Getting Help
1. **Check logs first**: `docker compose logs -f`
2. **Database health**: Run health check queries
3. **System resources**: Check disk space and memory
4. **Network connectivity**: Test database and Redis connections

### Common Solutions
- **Slow performance**: Run database maintenance
- **Memory issues**: Increase Docker memory limits
- **Disk space**: Clean up old logs and backups
- **Connection errors**: Restart services

---

**Need more help?** Check the full README.md or create an issue in the repository.

🎉 **You're all set!** Your ISP Management System is ready to manage customers, billing, and network operations.
