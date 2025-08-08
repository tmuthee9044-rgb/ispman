-- Core ISP Management System Tables

-- Company profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(255),
    registration_number VARCHAR(100),
    tax_number VARCHAR(100),
    description TEXT,
    industry VARCHAR(100) DEFAULT 'Internet Service Provider',
    
    -- Contact Information
    physical_address TEXT NOT NULL,
    postal_address TEXT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Kenya',
    postal_code VARCHAR(20),
    timezone VARCHAR(50) NOT NULL DEFAULT 'Africa/Nairobi',
    main_phone VARCHAR(20) NOT NULL,
    support_phone VARCHAR(20),
    main_email VARCHAR(255) NOT NULL,
    support_email VARCHAR(255),
    website VARCHAR(255),
    
    -- Branding
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3b82f6',
    secondary_color VARCHAR(7) DEFAULT '#64748b',
    
    -- Localization
    currency VARCHAR(10) NOT NULL DEFAULT 'KES',
    language VARCHAR(10) NOT NULL DEFAULT 'en',
    date_format VARCHAR(20) NOT NULL DEFAULT 'dd/mm/yyyy',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) UNIQUE NOT NULL DEFAULT generate_customer_id(),
    customer_type VARCHAR(50) DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business', 'corporate')),
    
    -- Personal/Business Information
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    company_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alternate_phone VARCHAR(50),
    id_number VARCHAR(100),
    tax_pin VARCHAR(100),
    business_registration VARCHAR(100),
    
    -- Address Information
    physical_address TEXT,
    postal_address VARCHAR(255),
    city VARCHAR(100),
    county VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Kenya',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Portal Access
    portal_login_id VARCHAR(100) UNIQUE NOT NULL,
    portal_username VARCHAR(100) UNIQUE NOT NULL,
    portal_password_hash VARCHAR(255),
    portal_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    
    -- Account Status
    status customer_status DEFAULT 'active',
    account_balance DECIMAL(15,2) DEFAULT 0.00,
    credit_limit DECIMAL(15,2) DEFAULT 0.00,
    
    -- Payment Preferences
    preferred_payment_method VARCHAR(50) DEFAULT 'mpesa',
    mpesa_number VARCHAR(50),
    airtel_number VARCHAR(50),
    bank_details JSONB,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    notes TEXT
);

-- Service plans table
CREATE TABLE IF NOT EXISTS service_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    
    -- Technical Specifications
    speed_down INTEGER NOT NULL, -- Mbps
    speed_up INTEGER NOT NULL, -- Mbps
    data_limit BIGINT, -- GB, NULL for unlimited
    burst_ratio DECIMAL(3,1) DEFAULT 1.0,
    
    -- Pricing (in KES)
    monthly_fee DECIMAL(10,2) NOT NULL,
    setup_fee DECIMAL(10,2) DEFAULT 0.00,
    equipment_fee DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Plan Details
    plan_type VARCHAR(50) DEFAULT 'residential' CHECK (plan_type IN ('residential', 'business', 'corporate', 'enterprise')),
    connection_types TEXT[] DEFAULT ARRAY['fiber', 'wireless'],
    features JSONB,
    terms_conditions TEXT,
    
    -- Status
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer services table
CREATE TABLE IF NOT EXISTS customer_services (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_plan_id INTEGER NOT NULL REFERENCES service_plans(id),
    
    -- Service Identification
    service_id VARCHAR(50) UNIQUE NOT NULL,
    service_name VARCHAR(255),
    
    -- Connection Details
    connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('fiber', 'wireless', 'dsl', 'cable')),
    ip_assignment VARCHAR(20) DEFAULT 'dhcp' CHECK (ip_assignment IN ('dhcp', 'static', 'pppoe')),
    static_ip INET,
    gateway INET,
    subnet_mask INET,
    dns_primary INET DEFAULT '8.8.8.8',
    dns_secondary INET DEFAULT '8.8.4.4',
    
    -- PPPoE Configuration
    pppoe_enabled BOOLEAN DEFAULT false,
    pppoe_username VARCHAR(255),
    pppoe_password VARCHAR(255),
    
    -- Equipment Assignment
    network_router_id INTEGER,
    customer_router_id INTEGER,
    ont_serial VARCHAR(100),
    
    -- Service Status
    status service_status DEFAULT 'pending',
    activation_date DATE,
    suspension_date DATE,
    termination_date DATE,
    suspension_reason TEXT,
    
    -- Billing
    monthly_fee DECIMAL(10,2) NOT NULL,
    billing_cycle INTEGER DEFAULT 30, -- days
    next_billing_date DATE,
    auto_renew BOOLEAN DEFAULT true,
    prorate_billing BOOLEAN DEFAULT true,
    
    -- Installation Details
    installation_date DATE,
    installation_address TEXT,
    installation_notes TEXT,
    technician_assigned VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Network infrastructure tables
CREATE TABLE IF NOT EXISTS network_routers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    router_type VARCHAR(50) NOT NULL CHECK (router_type IN ('edge', 'core', 'access', 'customer')),
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(255),
    
    -- Network Configuration
    ip_address INET NOT NULL,
    management_ip INET,
    subnet CIDR,
    vlan_id INTEGER,
    
    -- Location and Status
    location VARCHAR(255),
    site_id VARCHAR(100),
    rack_position VARCHAR(50),
    status VARCHAR(50) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    
    -- Performance Metrics
    cpu_load INTEGER DEFAULT 0 CHECK (cpu_load >= 0 AND cpu_load <= 100),
    memory_usage INTEGER DEFAULT 0 CHECK (memory_usage >= 0 AND memory_usage <= 100),
    bandwidth_usage DECIMAL(10,2) DEFAULT 0,
    uptime INTERVAL,
    last_ping TIMESTAMP WITH TIME ZONE,
    
    -- Configuration
    firmware_version VARCHAR(100),
    configuration_backup TEXT,
    snmp_community VARCHAR(100) DEFAULT 'public',
    snmp_enabled BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer equipment inventory
CREATE TABLE IF NOT EXISTS customer_routers (
    id SERIAL PRIMARY KEY,
    equipment_type VARCHAR(50) DEFAULT 'router' CHECK (equipment_type IN ('router', 'modem', 'ont', 'switch', 'access_point')),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    mac_address VARCHAR(17),
    
    -- Technical Specifications
    wifi_bands VARCHAR(100),
    max_speed VARCHAR(50),
    ethernet_ports INTEGER DEFAULT 4,
    wifi_standards TEXT[],
    firmware_version VARCHAR(100),
    
    -- Status and Allocation
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'allocated', 'maintenance', 'damaged', 'retired')),
    allocated_to_customer INTEGER REFERENCES customers(id),
    allocation_date TIMESTAMP WITH TIME ZONE,
    
    -- Purchase Information
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    supplier VARCHAR(255),
    warranty_expiry DATE,
    
    -- Location Tracking
    current_location VARCHAR(255),
    installation_address TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    
    -- Payment Details
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'KES',
    payment_method VARCHAR(100) NOT NULL,
    
    -- Transaction Information
    transaction_id VARCHAR(255),
    reference_number VARCHAR(255),
    external_reference VARCHAR(255),
    
    -- Gateway Specific Data
    gateway_response JSONB,
    mpesa_receipt_number VARCHAR(100),
    mpesa_phone_number VARCHAR(50),
    airtel_transaction_id VARCHAR(100),
    airtel_phone_number VARCHAR(50),
    
    -- Status and Dates
    status payment_status DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP WITH TIME ZONE,
    confirmed_date TIMESTAMP WITH TIME ZONE,
    
    -- Service Allocation
    allocated_amount DECIMAL(15,2),
    service_allocations JSONB,
    
    -- Processing Details
    processing_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(15,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL DEFAULT generate_invoice_number(),
    
    -- Invoice Amounts (KES)
    subtotal DECIMAL(15,2) NOT NULL CHECK (subtotal >= 0),
    tax_rate DECIMAL(5,4) DEFAULT 0.16, -- 16% VAT
    tax_amount DECIMAL(15,2) DEFAULT 0.00,
    discount_amount DECIMAL(15,2) DEFAULT 0.00,
    total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount >= 0),
    paid_amount DECIMAL(15,2) DEFAULT 0.00,
    balance_due DECIMAL(15,2) NOT NULL,
    
    -- Invoice Dates
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status and Terms
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'refunded')),
    payment_terms VARCHAR(100) DEFAULT 'Net 30',
    
    -- Invoice Content
    line_items JSONB NOT NULL,
    billing_period_start DATE,
    billing_period_end DATE,
    
    -- Metadata
    generated_by VARCHAR(100),
    sent_date DATE,
    reminder_count INTEGER DEFAULT 0,
    last_reminder_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    level log_level NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    ip_address INET,
    user_id VARCHAR(100),
    customer_id INTEGER REFERENCES customers(id),
    session_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default company profile
INSERT INTO company_profiles (
    name, 
    physical_address, 
    city, 
    country, 
    main_phone, 
    main_email,
    support_email,
    website
) VALUES (
    'TechConnect ISP',
    '123 Tech Street, Innovation District, Nairobi',
    'Nairobi',
    'Kenya',
    '+254 700 123 456',
    'info@techconnect.co.ke',
    'support@techconnect.co.ke',
    'https://techconnect.co.ke'
) ON CONFLICT DO NOTHING;
