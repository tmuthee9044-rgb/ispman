-- Initialize ISP Management Database
-- This script sets up the basic database structure and extensions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'Africa/Nairobi';

-- Create custom types
DO $$ BEGIN
    CREATE TYPE customer_status AS ENUM ('active', 'suspended', 'terminated', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_status AS ENUM ('active', 'suspended', 'terminated', 'pending', 'maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE log_level AS ENUM ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS customer_id_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1000;

-- Create utility functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    next_val INTEGER;
    year_part TEXT;
BEGIN
    SELECT nextval('invoice_number_seq') INTO next_val;
    SELECT EXTRACT(YEAR FROM CURRENT_DATE)::TEXT INTO year_part;
    RETURN 'INV-' || year_part || '-' || LPAD(next_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
DECLARE
    next_val INTEGER;
BEGIN
    SELECT nextval('customer_id_seq') INTO next_val;
    RETURN 'CUST' || LPAD(next_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Log system events
CREATE OR REPLACE FUNCTION log_system_event(
    p_level log_level,
    p_source VARCHAR(100),
    p_category VARCHAR(50),
    p_message TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_id VARCHAR(100) DEFAULT NULL,
    p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO system_logs (level, source, category, message, ip_address, user_id, details)
    VALUES (p_level, p_source, p_category, p_message, p_ip_address, p_user_id, p_details)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create audit log function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_data JSONB;
    new_data JSONB;
    excluded_cols TEXT[] := ARRAY['updated_at', 'last_login', 'last_seen'];
BEGIN
    IF TG_OP = 'DELETE' THEN
        old_data = to_jsonb(OLD);
        INSERT INTO audit_logs (table_name, operation, old_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, old_data, current_user, CURRENT_TIMESTAMP);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        old_data = to_jsonb(OLD);
        new_data = to_jsonb(NEW);
        -- Only log if there are actual changes (excluding timestamp columns)
        IF old_data - excluded_cols != new_data - excluded_cols THEN
            INSERT INTO audit_logs (table_name, operation, old_data, new_data, changed_by, changed_at)
            VALUES (TG_TABLE_NAME, TG_OP, old_data, new_data, current_user, CURRENT_TIMESTAMP);
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        new_data = to_jsonb(NEW);
        INSERT INTO audit_logs (table_name, operation, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, new_data, current_user, CURRENT_TIMESTAMP);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON DATABASE current_database() IS 'ISP Management System Database - TechConnect ISP';
