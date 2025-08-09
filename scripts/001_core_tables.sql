-- ISP Management System - Core Database Tables
-- This script creates the essential database structure

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    tax_number VARCHAR(100),
    registration_number VARCHAR(100),
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (for system authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    id_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active',
    customer_type VARCHAR(50) DEFAULT 'individual',
    registration_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service plans table
CREATE TABLE IF NOT EXISTS service_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    setup_fee DECIMAL(10,2) DEFAULT 0,
    speed_download_mbps INTEGER,
    speed_upload_mbps INTEGER,
    data_limit_gb INTEGER,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    is_active BOOLEAN DEFAULT true,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer services table
CREATE TABLE IF NOT EXISTS customer_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    service_plan_id UUID REFERENCES service_plans(id),
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    monthly_fee DECIMAL(10,2),
    installation_address TEXT,
    equipment_serial VARCHAR(100),
    ip_address INET,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    invoice_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert company data
INSERT INTO companies (name, email, phone, address, website) VALUES 
('Your ISP Company', 'admin@yourisp.com', '+254700000000', 'Nairobi, Kenya', 'https://yourisp.com')
ON CONFLICT DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@yourisp.com', '$2b$10$rQZ9QmjlZKZZ9QmjlZKZZOeKZZ9QmjlZKZZ9QmjlZKZZ9QmjlZKZZ', 'System Administrator', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert service plans
INSERT INTO service_plans (name, description, price, setup_fee, speed_download_mbps, speed_upload_mbps, data_limit_gb, features) VALUES 
('Basic Home', 'Perfect for light internet usage', 1200.00, 500.00, 5, 2, 50, '{"wifi": true, "support": "email"}'),
('Standard Home', 'Great for streaming and browsing', 2500.00, 500.00, 10, 5, 100, '{"wifi": true, "support": "phone", "streaming": true}'),
('Premium Home', 'High-speed for heavy users', 4000.00, 1000.00, 20, 10, 200, '{"wifi": true, "support": "priority", "streaming": true, "gaming": true}'),
('Business Basic', 'Small business solution', 5000.00, 1500.00, 25, 15, 300, '{"wifi": true, "support": "priority", "static_ip": true}'),
('Business Standard', 'Growing business needs', 8000.00, 2000.00, 50, 25, 500, '{"wifi": true, "support": "24/7", "static_ip": true, "backup": true}'),
('Business Premium', 'Enterprise-grade connectivity', 12000.00, 3000.00, 100, 50, 1000, '{"wifi": true, "support": "24/7", "static_ip": true, "backup": true, "sla": "99.9%"}'),
('Enterprise', 'Large organization solution', 20000.00, 5000.00, 200, 100, 2000, '{"wifi": true, "support": "dedicated", "static_ip": true, "backup": true, "sla": "99.95%"}'),
('Corporate Unlimited', 'Unlimited enterprise solution', 35000.00, 10000.00, 500, 250, NULL, '{"wifi": true, "support": "dedicated", "static_ip": true, "backup": true, "sla": "99.99%", "unlimited": true}')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON customers(customer_number);

CREATE INDEX IF NOT EXISTS idx_service_plans_price ON service_plans(price);
CREATE INDEX IF NOT EXISTS idx_service_plans_active ON service_plans(is_active);

CREATE INDEX IF NOT EXISTS idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_services_status ON customer_services(status);
CREATE INDEX IF NOT EXISTS idx_customer_services_dates ON customer_services(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);
