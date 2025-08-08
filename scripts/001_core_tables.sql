-- ISP Management System - Core Tables
-- This script creates all the main tables for the system

-- Company profile table
CREATE TABLE company_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_logo TEXT,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    tax_number VARCHAR(50),
    currency VARCHAR(3) DEFAULT 'KES',
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default company profile
INSERT INTO company_profiles (company_name, address, phone, email, currency)
VALUES ('Your ISP Company', 'Nairobi, Kenya', '+254700000000', 'info@yourisp.com', 'KES');

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id VARCHAR(20) UNIQUE NOT NULL DEFAULT generate_customer_id(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    location_coordinates POINT,
    customer_type VARCHAR(20) DEFAULT 'individual',
    status customer_status DEFAULT 'pending',
    balance DECIMAL(12,2) DEFAULT 0.00,
    credit_limit DECIMAL(12,2) DEFAULT 0.00,
    portal_access BOOLEAN DEFAULT true,
    portal_password_hash TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service plans table
CREATE TABLE service_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    download_speed INTEGER NOT NULL, -- in Mbps
    upload_speed INTEGER NOT NULL, -- in Mbps
    data_limit INTEGER, -- in GB, NULL for unlimited
    monthly_price DECIMAL(10,2) NOT NULL,
    setup_fee DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer services table
CREATE TABLE customer_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_plan_id UUID NOT NULL REFERENCES service_plans(id),
    status service_status DEFAULT 'pending_activation',
    installation_date DATE,
    activation_date DATE,
    suspension_date DATE,
    termination_date DATE,
    monthly_price DECIMAL(10,2) NOT NULL,
    billing_cycle_start INTEGER DEFAULT 1, -- day of month
    last_billed_date DATE,
    next_billing_date DATE,
    ip_address INET,
    router_id UUID,
    equipment_ids UUID[],
    installation_notes TEXT,
    technical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Network routers table
CREATE TABLE network_routers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    ip_address INET NOT NULL UNIQUE,
    location VARCHAR(255),
    status router_status DEFAULT 'offline',
    last_ping TIMESTAMP,
    uptime_seconds BIGINT DEFAULT 0,
    cpu_usage DECIMAL(5,2),
    memory_usage DECIMAL(5,2),
    bandwidth_usage JSONB,
    configuration JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Equipment inventory table
CREATE TABLE equipment_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    brand VARCHAR(255),
    serial_number VARCHAR(255) UNIQUE,
    mac_address VARCHAR(17),
    equipment_type VARCHAR(50) NOT NULL,
    status equipment_status DEFAULT 'available',
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    warranty_expiry DATE,
    allocated_to_customer UUID REFERENCES customers(id),
    allocation_date DATE,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_reference VARCHAR(255),
    transaction_id VARCHAR(255),
    status payment_status DEFAULT 'pending',
    payment_date TIMESTAMP,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL DEFAULT generate_invoice_number(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES customer_services(id),
    amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status payment_status DEFAULT 'pending',
    description TEXT,
    line_items JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL DEFAULT ('TKT' || nextval('ticket_number_seq')),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    assigned_to VARCHAR(255),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- System logs table
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100),
    action VARCHAR(50),
    record_id VARCHAR(100),
    user_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    level log_level DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IP address management
CREATE TABLE ip_subnets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subnet CIDR NOT NULL UNIQUE,
    description TEXT,
    vlan_id INTEGER,
    gateway INET,
    dns_servers INET[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ip_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL UNIQUE,
    subnet_id UUID NOT NULL REFERENCES ip_subnets(id),
    customer_id UUID REFERENCES customers(id),
    service_id UUID REFERENCES customer_services(id),
    status VARCHAR(20) DEFAULT 'available',
    assigned_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comments for documentation
COMMENT ON TABLE customers IS 'Customer information and account details';
COMMENT ON TABLE service_plans IS 'Available internet service plans and pricing';
COMMENT ON TABLE customer_services IS 'Active services assigned to customers';
COMMENT ON TABLE payments IS 'Payment transactions and history';
COMMENT ON TABLE invoices IS 'Generated invoices and billing records';
COMMENT ON TABLE support_tickets IS 'Customer support tickets and issues';
COMMENT ON TABLE network_routers IS 'Network infrastructure and monitoring';
COMMENT ON TABLE equipment_inventory IS 'Customer premises equipment tracking';
