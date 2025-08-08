-- ISP Management System - Indexes and Constraints
-- This script creates indexes for performance and adds data validation constraints

-- Performance indexes for customers
CREATE INDEX idx_customers_customer_id ON customers(customer_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_created_at ON customers(created_at);
CREATE INDEX idx_customers_location ON customers USING GIST(location_coordinates);

-- Full-text search index for customers
CREATE INDEX idx_customers_search ON customers USING GIN(
    to_tsvector('english', 
        COALESCE(first_name, '') || ' ' || 
        COALESCE(last_name, '') || ' ' || 
        COALESCE(email, '') || ' ' || 
        COALESCE(phone, '')
    )
);

-- Service plans indexes
CREATE INDEX idx_service_plans_active ON service_plans(is_active);
CREATE INDEX idx_service_plans_price ON service_plans(monthly_price);
CREATE INDEX idx_service_plans_speed ON service_plans(download_speed, upload_speed);

-- Customer services indexes
CREATE INDEX idx_customer_services_customer ON customer_services(customer_id);
CREATE INDEX idx_customer_services_plan ON customer_services(service_plan_id);
CREATE INDEX idx_customer_services_status ON customer_services(status);
CREATE INDEX idx_customer_services_billing ON customer_services(next_billing_date);
CREATE INDEX idx_customer_services_ip ON customer_services(ip_address);

-- Composite index for active services
CREATE INDEX idx_customer_services_active ON customer_services(customer_id, status) 
WHERE status = 'active';

-- Payments indexes
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(payment_method);
CREATE INDEX idx_payments_reference ON payments(payment_reference);

-- Invoices indexes
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_service ON invoices(service_id);

-- Support tickets indexes
CREATE INDEX idx_tickets_customer ON support_tickets(customer_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_tickets_created ON support_tickets(created_at);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to);

-- Network routers indexes
CREATE INDEX idx_routers_ip ON network_routers(ip_address);
CREATE INDEX idx_routers_status ON network_routers(status);
CREATE INDEX idx_routers_location ON network_routers(location);

-- Equipment indexes
CREATE INDEX idx_equipment_status ON equipment_inventory(status);
CREATE INDEX idx_equipment_customer ON equipment_inventory(allocated_to_customer);
CREATE INDEX idx_equipment_type ON equipment_inventory(equipment_type);
CREATE INDEX idx_equipment_serial ON equipment_inventory(serial_number);

-- System logs indexes
CREATE INDEX idx_logs_table ON system_logs(table_name);
CREATE INDEX idx_logs_created ON system_logs(created_at);
CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_record ON system_logs(record_id);

-- Partial indexes for better performance
CREATE INDEX idx_customers_active ON customers(id) WHERE status = 'active';
CREATE INDEX idx_services_active ON customer_services(id) WHERE status = 'active';
CREATE INDEX idx_invoices_unpaid ON invoices(id) WHERE status IN ('pending', 'overdue');
CREATE INDEX idx_tickets_open ON support_tickets(id) WHERE status IN ('open', 'in_progress');

-- IP management indexes
CREATE INDEX idx_ip_subnets_active ON ip_subnets(subnet) WHERE is_active = true;
CREATE INDEX idx_ip_addresses_available ON ip_addresses(ip_address) WHERE status = 'available';
CREATE INDEX idx_ip_addresses_customer ON ip_addresses(customer_id);

-- Add check constraints for data validation
ALTER TABLE customers ADD CONSTRAINT chk_customers_email 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE customers ADD CONSTRAINT chk_customers_phone 
    CHECK (phone ~ '^\+?[0-9\s\-$$$$]{10,20}$');

ALTER TABLE customers ADD CONSTRAINT chk_customers_balance 
    CHECK (balance >= -credit_limit);

ALTER TABLE service_plans ADD CONSTRAINT chk_service_plans_speeds 
    CHECK (download_speed > 0 AND upload_speed > 0);

ALTER TABLE service_plans ADD CONSTRAINT chk_service_plans_price 
    CHECK (monthly_price >= 0 AND setup_fee >= 0);

ALTER TABLE customer_services ADD CONSTRAINT chk_customer_services_dates 
    CHECK (
        (installation_date IS NULL OR activation_date IS NULL OR installation_date <= activation_date) AND
        (activation_date IS NULL OR suspension_date IS NULL OR activation_date <= suspension_date) AND
        (activation_date IS NULL OR termination_date IS NULL OR activation_date <= termination_date)
    );

ALTER TABLE payments ADD CONSTRAINT chk_payments_amount 
    CHECK (amount > 0);

ALTER TABLE invoices ADD CONSTRAINT chk_invoices_amounts 
    CHECK (amount >= 0 AND tax_amount >= 0 AND total_amount >= 0);

ALTER TABLE invoices ADD CONSTRAINT chk_invoices_total 
    CHECK (total_amount = amount + tax_amount);

-- Add foreign key constraints with proper cascading
ALTER TABLE customer_services ADD CONSTRAINT fk_customer_services_router 
    FOREIGN KEY (router_id) REFERENCES network_routers(id) ON DELETE SET NULL;

-- Create unique constraints
ALTER TABLE customers ADD CONSTRAINT uk_customers_customer_id UNIQUE (customer_id);
ALTER TABLE invoices ADD CONSTRAINT uk_invoices_number UNIQUE (invoice_number);
ALTER TABLE support_tickets ADD CONSTRAINT uk_tickets_number UNIQUE (ticket_number);
