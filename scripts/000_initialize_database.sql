-- ISP Management System Database Initialization
-- This script sets up the PostgreSQL database with all necessary extensions and configurations

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Set timezone to East Africa Time (Kenya)
SET timezone = 'Africa/Nairobi';

-- Create custom types for the ISP system
CREATE TYPE customer_status AS ENUM ('active', 'suspended', 'terminated', 'pending');
CREATE TYPE service_status AS ENUM ('active', 'suspended', 'pending', 'terminated');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('mpesa', 'airtel_money', 'bank_transfer', 'cash', 'cheque');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE router_status AS ENUM ('online', 'offline', 'maintenance', 'error');
CREATE TYPE equipment_status AS ENUM ('available', 'allocated', 'maintenance', 'damaged', 'retired');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'terminated', 'on_leave');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE vehicle_status AS ENUM ('active', 'maintenance', 'out_of_service', 'retired');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE log_level AS ENUM ('info', 'warning', 'error', 'critical');

-- Create utility functions
CREATE OR REPLACE FUNCTION generate_customer_id() RETURNS TEXT AS $$
BEGIN
    RETURN 'CUST' || LPAD(nextval('customer_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS TEXT AS $$
BEGIN
    RETURN 'INV' || TO_CHAR(NOW(), 'YYYY') || LPAD(nextval('invoice_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_number() RETURNS TEXT AS $$
BEGIN
    RETURN 'TKT' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('ticket_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS customer_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- Create audit log function
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, operation, new_data, user_id, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), current_setting('app.current_user_id', true), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, operation, old_data, new_data, user_id, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, operation, old_data, user_id, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), current_setting('app.current_user_id', true), NOW());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Log initialization
INSERT INTO system_logs (level, message, details) 
VALUES ('info', 'Database initialization started', '{"script": "000_initialize_database.sql"}');

COMMIT;
