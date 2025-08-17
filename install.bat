@echo off
setlocal enabledelayedexpansion

:: ISP Management System Installation Script for Windows
:: This script will install Docker Desktop, set up the ISP system, and run it

echo.
echo 🚀 ISP Management System Installation Script (Windows)
echo =======================================================
echo.

:: Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] This script must be run as Administrator
    echo Right-click on the script and select "Run as administrator"
    pause
    exit /b 1
)

:: Function to print colored output (Windows doesn't support colors easily, so we'll use plain text)
echo [INFO] Starting installation process...

:: Check if Docker Desktop is installed
docker --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Docker Desktop not found. Please install Docker Desktop manually.
    echo [INFO] Download from: https://www.docker.com/products/docker-desktop
    echo [INFO] After installation, restart this script.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Docker Desktop is installed
)

:: Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Docker Compose not found. Please ensure Docker Desktop is properly installed.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Docker Compose is available
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorLevel% neq 0 (
    echo [WARNING] Node.js not found. Please install Node.js 18 or later.
    echo [INFO] Download from: https://nodejs.org/
    echo [INFO] After installation, restart this script.
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js is installed
)

:: Create necessary directories
echo [INFO] Setting up directories and configuration files...
if not exist "ssl" mkdir ssl
if not exist "radius-config" mkdir radius-config
if not exist "logs" mkdir logs

:: Create nginx configuration
echo [INFO] Creating nginx configuration...
(
echo events {
echo     worker_connections 1024;
echo }
echo.
echo http {
echo     upstream isp_app {
echo         server isp_app:3000;
echo     }
echo.
echo     server {
echo         listen 80;
echo         server_name localhost;
echo.
echo         location / {
echo             proxy_pass http://isp_app;
echo             proxy_set_header Host $host;
echo             proxy_set_header X-Real-IP $remote_addr;
echo             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
echo             proxy_set_header X-Forwarded-Proto $scheme;
echo         }
echo     }
echo }
) > nginx.conf

:: Create environment file
echo [INFO] Creating environment configuration...
(
echo # Database Configuration
echo DATABASE_URL=mysql://isp_user:isp_password_2024@mysql:3306/isp_system
echo POSTGRES_HOST=mysql
echo POSTGRES_USER=isp_user
echo POSTGRES_PASSWORD=isp_password_2024
echo POSTGRES_DATABASE=isp_system
echo DB_PORT=3306
echo.
echo # Application Configuration
echo NODE_ENV=production
echo NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
echo NEXTAUTH_URL=http://localhost:3000
echo.
echo # MySQL Root Password
echo MYSQL_ROOT_PASSWORD=isp_root_password_2024
) > .env

echo [SUCCESS] Configuration files created

:: Start the ISP system
echo [INFO] Starting ISP Management System...
docker-compose up -d --build

if %errorLevel% neq 0 (
    echo [ERROR] Failed to start the system. Check Docker Desktop is running.
    pause
    exit /b 1
)

:: Wait for services to start
echo [INFO] Waiting for services to start...
timeout /t 30 /nobreak >nul

:: Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorLevel% equ 0 (
    echo.
    echo [SUCCESS] ISP Management System started successfully!
    echo.
    echo 🎉 Installation Complete!
    echo ========================
    echo.
    echo Access your ISP Management System at:
    echo 🌐 Web Interface: http://localhost:3000
    echo 🗄️  Database: localhost:3306
    echo 🔐 RADIUS Server: localhost:1812 (Auth), localhost:1813 (Accounting)
    echo 🔒 OpenVPN Server: localhost:1194
    echo.
    echo Default Database Credentials:
    echo Username: isp_user
    echo Password: isp_password_2024
    echo Database: isp_system
    echo.
    echo ⚠️  IMPORTANT: Change default passwords in production!
    echo.
    echo To stop the system: docker-compose down
    echo To view logs: docker-compose logs -f
    echo To restart: docker-compose restart
) else (
    echo [ERROR] Some services failed to start. Check logs with: docker-compose logs
    pause
    exit /b 1
)

echo.
echo Press any key to exit...
pause >nul
