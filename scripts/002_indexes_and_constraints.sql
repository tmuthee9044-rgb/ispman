-- Indexes and Constraints for ISP Management System

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_customer_id ON customers(customer_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_portal_login_id ON customers(portal_login_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_customers_location ON customers(city, county);

-- Customer services indexes
CREATE INDEX IF NOT EXISTS idx_customer_services_customer_id ON customer_services(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_services_service_plan_id ON customer_services(service_plan_id);
CREATE INDEX IF NOT EXISTS idx_customer_services_status ON customer_services(status);
CREATE INDEX IF NOT EXISTS idx_customer_services_activation_date ON customer_services(activation_date);
CREATE INDEX IF NOT EXISTS idx_customer_services_next_billing_date ON customer_services(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_customer_services_service_id ON customer_services(service_id);

-- Service plans indexes
CREATE INDEX IF NOT EXISTS idx_service_plans_plan_code ON service_plans(plan_code);
CREATE INDEX IF NOT EXISTS idx_service_plans_active ON service_plans(active);
CREATE INDEX IF NOT EXISTS idx_service_plans_plan_type ON service_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_service_plans_monthly_fee ON service_plans(monthly_fee);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON payments(payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_amount ON payments(amount);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_total_amount ON invoices(total_amount);
CREATE INDEX IF NOT EXISTS idx_invoices_balance_due ON invoices(balance_due);

-- Network routers indexes
CREATE INDEX IF NOT EXISTS idx_network_routers_ip_address ON network_routers(ip_address);
CREATE INDEX IF NOT EXISTS idx_network_routers_status ON network_routers(status);
CREATE INDEX IF NOT EXISTS idx_network_routers_location ON network_routers(location);
CREATE INDEX IF NOT EXISTS idx_network_routers_router_type ON network_routers(router_type);
CREATE INDEX IF NOT EXISTS idx_network_routers_last_ping ON network_routers(last_ping);

-- Customer routers indexes
CREATE INDEX IF NOT EXISTS idx_customer_routers_serial_number ON customer_routers(serial_number);
CREATE INDEX IF NOT EXISTS idx_customer_routers_status ON customer_routers(status);
CREATE INDEX IF NOT EXISTS idx_customer_routers_allocated_customer ON customer_routers(allocated_to_customer);
CREATE INDEX IF NOT EXISTS idx_customer_routers_brand_model ON customer_routers(brand, model);

-- System logs indexes
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_source ON system_logs(source);
CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category);
CREATE INDEX IF NOT EXISTS idx_system_logs_customer_id ON system_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_operation ON audit_logs(operation);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_at ON audit_logs(changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_changed_by ON audit_logs(changed_by);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_customers_search ON customers USING gin(
    to_tsvector('english', 
        COALESCE(first_name, '') || ' ' || 
        COALESCE(last_name, '') || ' ' || 
        COALESCE(company_name, '') || ' ' || 
        COALESCE(email, '') || ' ' || 
        COALESCE(phone, '')
    )
);

CREATE INDEX IF NOT EXISTS idx_service_plans_search ON service_plans USING gin(
    to_tsvector('english', 
        COALESCE(name, '') || ' ' || 
        COALESCE(description, '')
    )
);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_customers_status_created ON customers(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_customer_status_date ON payments(customer_id, status, payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_status_date ON invoices(customer_id, status, invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_customer_services_customer_status ON customer_services(customer_id, status);

-- Partial indexes for active records
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(id) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_service_plans_active ON service_plans(id) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_customer_services_active ON customer_services(id) WHERE status = 'active';

-- Check constraints
ALTER TABLE customers ADD CONSTRAINT chk_customers_email_format 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE customers ADD CONSTRAINT chk_customers_phone_format 
    CHECK (phone ~ '^\+?[0-9\s\-$$$$]{10,15}$');

ALTER TABLE service_plans ADD CONSTRAINT chk_service_plans_speeds 
    CHECK (speed_down > 0 AND speed_up > 0 AND speed_up <= speed_down);

ALTER TABLE service_plans ADD CONSTRAINT chk_service_plans_fees 
    CHECK (monthly_fee >= 0 AND setup_fee >= 0 AND equipment_fee >= 0);

ALTER TABLE payments ADD CONSTRAINT chk_payments_amount_positive 
    CHECK (amount > 0);

ALTER TABLE invoices ADD CONSTRAINT chk_invoices_amounts 
    CHECK (subtotal >= 0 AND total_amount >= 0 AND balance_due >= 0);

ALTER TABLE invoices ADD CONSTRAINT chk_invoices_dates 
    CHECK (due_date >= invoice_date);

-- Foreign key constraints with proper cascading
ALTER TABLE customer_services 
    ADD CONSTRAINT fk_customer_services_network_router 
    FOREIGN KEY (network_router_id) REFERENCES network_routers(id) ON DELETE SET NULL;

ALTER TABLE customer_services 
    ADD CONSTRAINT fk_customer_services_customer_router 
    FOREIGN KEY (customer_router_id) REFERENCES customer_routers(id) ON DELETE SET NULL;

-- Unique constraints
ALTER TABLE customers ADD CONSTRAINT uk_customers_portal_username UNIQUE (portal_username);
ALTER TABLE service_plans ADD CONSTRAINT uk_service_plans_plan_code UNIQUE (plan_code);
ALTER TABLE customer_services ADD CONSTRAINT uk_customer_services_service_id UNIQUE (service_id);
ALTER TABLE network_routers ADD CONSTRAINT uk_network_routers_ip_address UNIQUE (ip_address);
ALTER TABLE customer_routers ADD CONSTRAINT uk_customer_routers_serial_number UNIQUE (serial_number);

-- Comments for documentation
COMMENT ON TABLE customers IS 'Customer information and account details';
COMMENT ON TABLE service_plans IS 'Available internet service plans and pricing';
COMMENT ON TABLE customer_services IS 'Active services assigned to customers';
COMMENT ON TABLE network_routers IS 'Network infrastructure routers and equipment';
COMMENT ON TABLE customer_routers IS 'Customer premises equipment inventory';
COMMENT ON TABLE payments IS 'Payment transactions and processing records';
COMMENT ON TABLE invoices IS 'Customer billing invoices and statements';
COMMENT ON TABLE system_logs IS 'System activity and event logs';
COMMENT ON TABLE audit_logs IS 'Data change audit trail';

-- Column comments
COMMENT ON COLUMN customers.customer_id IS 'Unique customer identifier (CUST000001)';
COMMENT ON COLUMN customers.portal_login_id IS 'Customer portal login identifier';
COMMENT ON COLUMN customers.account_balance IS 'Current account balance in KES';
COMMENT ON COLUMN service_plans.speed_down IS 'Download speed in Mbps';
COMMENT ON COLUMN service_plans.speed_up IS 'Upload speed in Mbps';
COMMENT ON COLUMN service_plans.monthly_fee IS 'Monthly service fee in KES';
COMMENT ON COLUMN payments.amount IS 'Payment amount in KES';
COMMENT ON COLUMN invoices.total_amount IS 'Total invoice amount in KES';
