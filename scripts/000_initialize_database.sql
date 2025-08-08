-- ISP Management System - Database Initialization
-- This script sets up the database with all necessary extensions and configurations

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE customer_status AS ENUM ('active', 'suspended', 'terminated', 'pending');
CREATE TYPE service_status AS ENUM ('active', 'suspended', 'terminated', 'pending_activation');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('mpesa', 'airtel_money', 'bank_transfer', 'cash', 'cheque');
CREATE TYPE log_level AS ENUM ('info', 'warning', 'error', 'critical');
CREATE TYPE equipment_status AS ENUM ('available', 'allocated', 'maintenance', 'faulty', 'retired');
CREATE TYPE router_status AS ENUM ('online', 'offline', 'maintenance', 'error');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Create sequences for auto-generating IDs
CREATE SEQUENCE IF NOT EXISTS customer_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 10000;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1000;

-- Create utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'CUST' || LPAD(nextval('customer_id_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'INV' || TO_CHAR(CURRENT_DATE, 'YYYY') || LPAD(nextval('invoice_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Logging function
CREATE OR REPLACE FUNCTION log_activity(
    p_table_name TEXT,
    p_action TEXT,
    p_record_id TEXT,
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO system_logs (table_name, action, record_id, details, created_at)
    VALUES (p_table_name, p_action, p_record_id, p_details, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

-- Initialize database settings
ALTER DATABASE isp_system SET timezone TO 'Africa/Nairobi';

COMMENT ON DATABASE isp_system IS 'ISP Management System Database - Initialized';
