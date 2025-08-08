-- Create comprehensive ISP database schema with KES currency support

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_type VARCHAR(50) DEFAULT 'individual',
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    company_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    id_number VARCHAR(100),
    tax_pin VARCHAR(100),
    business_registration VARCHAR(100),
    
    -- Address information
    physical_address TEXT,
    postal_address VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Kenya',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Portal access
    portal_login_id VARCHAR(100) UNIQUE NOT NULL,
    portal_username VARCHAR(100) UNIQUE NOT NULL,
    portal_password_hash VARCHAR(255),
    portal_active BOOLEAN DEFAULT true,
    
    -- Account status
    status VARCHAR(50) DEFAULT 'active',
    account_balance DECIMAL(15,2) DEFAULT 0.00,
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    
    -- Payment preferences
    preferred_payment_method VARCHAR(50) DEFAULT 'mpesa',
    mpesa_number VARCHAR(50),
    airtel_number VARCHAR(50),
    bank_details TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    notes TEXT
);

-- Service plans table
CREATE TABLE IF NOT EXISTS service_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    speed_down INTEGER NOT NULL, -- Mbps
    speed_up INTEGER NOT NULL, -- Mbps
    data_limit BIGINT, -- GB, NULL for unlimited
    monthly_fee DECIMAL(10,2) NOT NULL, -- KES
    setup_fee DECIMAL(10,2) DEFAULT 0.00, -- KES
    currency VARCHAR(3) DEFAULT 'KES',
    plan_type VARCHAR(50) DEFAULT 'residential',
    features JSON,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer services table
CREATE TABLE IF NOT EXISTS customer_services (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    service_plan_id INTEGER NOT NULL REFERENCES service_plans(id),
    
    -- Connection details
    connection_type VARCHAR(50) NOT NULL,
    ip_assignment VARCHAR(20) DEFAULT 'dhcp',
    static_ip INET,
    gateway INET,
    dns_primary INET,
    dns_secondary INET,
    
    -- PPPoE configuration
    pppoe_enabled BOOLEAN DEFAULT false,
    pppoe_username VARCHAR(255),
    pppoe_password VARCHAR(255),
    pppoe_ip_type VARCHAR(20) DEFAULT 'dhcp',
    pppoe_static_ip INET,
    pppoe_gateway INET,
    
    -- Router assignments
    network_router_id INTEGER,
    customer_router_id INTEGER,
    
    -- Service status
    status VARCHAR(50) DEFAULT 'pending',
    activation_date DATE,
    suspension_date DATE,
    termination_date DATE,
    auto_renew BOOLEAN DEFAULT true,
    
    -- Billing
    monthly_fee DECIMAL(10,2) NOT NULL,
    next_billing_date DATE,
    days_remaining INTEGER DEFAULT 30,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer routers inventory
CREATE TABLE IF NOT EXISTS customer_routers (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    mac_address VARCHAR(17),
    
    -- Specifications
    wifi_bands VARCHAR(100),
    max_speed VARCHAR(50),
    ports VARCHAR(100),
    firmware_version VARCHAR(100),
    
    -- Status and allocation
    status VARCHAR(50) DEFAULT 'available', -- available, allocated, maintenance, damaged
    allocated_to_customer INTEGER REFERENCES customers(id),
    allocation_date TIMESTAMP,
    
    -- Purchase information
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    supplier VARCHAR(255),
    warranty_expiry DATE,
    
    -- Location tracking
    current_location VARCHAR(255),
    installation_address TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Network routers table
CREATE TABLE IF NOT EXISTS network_routers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'online',
    cpu_load INTEGER DEFAULT 0,
    memory_usage INTEGER DEFAULT 0,
    uptime VARCHAR(100),
    last_ping TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    payment_method VARCHAR(100) NOT NULL,
    
    -- Payment gateway details
    transaction_id VARCHAR(255),
    reference_number VARCHAR(255),
    gateway_response JSON,
    
    -- M-Pesa specific
    mpesa_receipt_number VARCHAR(100),
    mpesa_phone_number VARCHAR(50),
    
    -- Airtel Money specific
    airtel_transaction_id VARCHAR(100),
    airtel_phone_number VARCHAR(50),
    
    -- Status and dates
    status VARCHAR(50) DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP,
    
    -- Allocation to services
    allocated_amount DECIMAL(15,2),
    service_allocations JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    
    -- Amounts in KES
    subtotal DECIMAL(15,2) NOT NULL,
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL,
    paid_amount DECIMAL(15,2) DEFAULT 0.00,
    balance_due DECIMAL(15,2) NOT NULL,
    
    -- Dates
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    
    -- Invoice details
    line_items JSON,
    payment_terms VARCHAR(100) DEFAULT 'Net 30',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level VARCHAR(20) NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address INET,
    user_id INTEGER,
    customer_id INTEGER,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment gateway settings
CREATE TABLE IF NOT EXISTS payment_gateway_settings (
    id SERIAL PRIMARY KEY,
    gateway_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT false,
    configuration JSON NOT NULL,
    test_mode BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    registration VARCHAR(50) UNIQUE NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    
    -- Status and assignment
    status VARCHAR(50) DEFAULT 'active',
    assigned_driver VARCHAR(255),
    current_location VARCHAR(255),
    
    -- Maintenance and service
    mileage INTEGER DEFAULT 0,
    fuel_consumption DECIMAL(5,2), -- L/100km
    last_service_date DATE,
    next_service_date DATE,
    insurance_expiry DATE,
    
    -- Financial
    purchase_price DECIMAL(15,2),
    current_value DECIMAL(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Insert default service plans with KES pricing
INSERT INTO service_plans (name, description, speed_down, speed_up, monthly_fee, plan_type, features) VALUES
('Basic Plan', 'Perfect for light internet usage, email, and basic browsing', 10, 5, 2999.00, 'residential', '["Email & Web Browsing", "Basic Streaming", "24/7 Support"]'),
('Standard Plan', 'Great for streaming, video calls, and moderate usage', 50, 25, 4999.00, 'residential', '["HD Streaming", "Video Calls", "Multiple Devices", "24/7 Support"]'),
('Premium Plan', 'High-speed internet for heavy usage, gaming, and 4K streaming', 100, 50, 7999.00, 'residential', '["4K Streaming", "Gaming", "Smart Home", "Priority Support"]'),
('Business Basic', 'Reliable internet solution for small businesses', 150, 75, 9999.00, 'business', '["Business Grade", "Static IP", "SLA Guarantee", "Priority Support"]'),
('Business Premium', 'Enterprise-grade internet for large businesses', 250, 125, 14999.00, 'business', '["Enterprise Grade", "Dedicated Support", "99.9% Uptime SLA", "Multiple Static IPs"]'),
('Ultra Plan', 'Maximum speed for power users and content creators', 500, 250, 19999.00, 'residential', '["Ultra-fast Speed", "Content Creation", "Gaming Pro", "Priority Support"]');

-- Insert default network routers
INSERT INTO network_routers (name, ip_address, location, status, cpu_load) VALUES
('Edge Router 1', '192.168.1.1', 'Tower A - Nairobi CBD', 'online', 45),
('Edge Router 2', '192.168.1.2', 'Tower B - Westlands', 'online', 62),
('Edge Router 3', '192.168.1.3', 'Tower C - Karen', 'online', 38),
('Edge Router 4', '192.168.1.4', 'Tower D - Kiambu', 'maintenance', 0);

-- Insert sample customer routers
INSERT INTO customer_routers (brand, model, serial_number, wifi_bands, max_speed, ports, status, purchase_price) VALUES
('TP-Link', 'Archer C6', 'TL2024001234', '2.4GHz + 5GHz', '1200Mbps', '4 LAN + 1 WAN', 'available', 8500.00),
('Huawei', 'HG8245H', 'HW2024005678', '2.4GHz + 5GHz', '1000Mbps', '4 LAN + 1 WAN + 2 TEL', 'available', 12000.00),
('ZTE', 'ZXHN F670L', 'ZT2024009012', '2.4GHz + 5GHz', '1200Mbps', '4 LAN + 1 WAN + 2 TEL', 'available', 11500.00),
('Mikrotik', 'hAP ac2', 'MT2024003456', '2.4GHz + 5GHz', '1200Mbps', '5 Gigabit Ethernet', 'available', 15000.00),
('Fiberhome', 'HG6245D', 'FH2024007890', '2.4GHz + 5GHz', '1000Mbps', '4 LAN + 1 WAN + 2 TEL', 'reserved', 10500.00);

-- Insert default payment gateway settings
INSERT INTO payment_gateway_settings (gateway_name, is_active, configuration, test_mode) VALUES
('mpesa', true, '{"consumer_key": "", "consumer_secret": "", "business_shortcode": "174379", "passkey": "", "callback_url": "", "timeout_url": ""}', true),
('airtel', true, '{"client_id": "", "client_secret": "", "api_key": "", "paybill_number": "", "callback_url": "", "webhook_url": ""}', true),
('bank_transfer', true, '{"bank_name": "Equity Bank", "account_number": "1234567890", "account_name": "TechConnect ISP Ltd", "branch_code": "001", "swift_code": "EQBLKENA"}', false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_portal_login_id ON customers(portal_login_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_customer_routers_serial ON customer_routers(serial_number);
CREATE INDEX IF NOT EXISTS idx_customer_routers_status ON customer_routers(status);
