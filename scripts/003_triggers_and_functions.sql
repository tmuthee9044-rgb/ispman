-- ISP Management System - Triggers and Functions
-- This script creates triggers for automatic updates and business logic functions

-- Create updated_at triggers for all tables
CREATE TRIGGER tr_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_service_plans_updated_at 
    BEFORE UPDATE ON service_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_customer_services_updated_at 
    BEFORE UPDATE ON customer_services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_network_routers_updated_at 
    BEFORE UPDATE ON network_routers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER tr_equipment_inventory_updated_at 
    BEFORE UPDATE ON equipment_inventory 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging triggers
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_activity(TG_TABLE_NAME, 'INSERT', NEW.id::TEXT, row_to_json(NEW)::JSONB);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_activity(TG_TABLE_NAME, 'UPDATE', NEW.id::TEXT, 
            jsonb_build_object('old', row_to_json(OLD)::JSONB, 'new', row_to_json(NEW)::JSONB));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_activity(TG_TABLE_NAME, 'DELETE', OLD.id::TEXT, row_to_json(OLD)::JSONB);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for sensitive tables
CREATE TRIGGER tr_customers_audit 
    AFTER INSERT OR UPDATE OR DELETE ON customers 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER tr_payments_audit 
    AFTER INSERT OR UPDATE OR DELETE ON payments 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER tr_customer_services_audit 
    AFTER INSERT OR UPDATE OR DELETE ON customer_services 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Business logic functions
CREATE OR REPLACE FUNCTION calculate_customer_balance(p_customer_id UUID)
RETURNS DECIMAL(12,2) AS $$
DECLARE
    total_invoices DECIMAL(12,2) := 0;
    total_payments DECIMAL(12,2) := 0;
    balance DECIMAL(12,2);
BEGIN
    -- Calculate total unpaid invoices
    SELECT COALESCE(SUM(total_amount), 0) INTO total_invoices
    FROM invoices 
    WHERE customer_id = p_customer_id AND status IN ('pending', 'overdue');
    
    -- Calculate total payments
    SELECT COALESCE(SUM(amount), 0) INTO total_payments
    FROM payments 
    WHERE customer_id = p_customer_id AND status = 'completed';
    
    balance := total_payments - total_invoices;
    
    -- Update customer balance
    UPDATE customers SET balance = balance WHERE id = p_customer_id;
    
    RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Function to update service status based on payment
CREATE OR REPLACE FUNCTION update_service_status_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Reactivate suspended services if balance becomes positive
        UPDATE customer_services 
        SET status = 'active'
        WHERE customer_id = NEW.customer_id 
        AND status = 'suspended'
        AND EXISTS (
            SELECT 1 FROM customers 
            WHERE id = NEW.customer_id 
            AND calculate_customer_balance(id) >= 0
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_payment_service_status 
    AFTER UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_service_status_on_payment();

-- Function to automatically allocate IP addresses
CREATE OR REPLACE FUNCTION allocate_ip_address(p_customer_id UUID, p_service_id UUID)
RETURNS INET AS $$
DECLARE
    allocated_ip INET;
BEGIN
    -- Find first available IP address
    SELECT ip_address INTO allocated_ip
    FROM ip_addresses 
    WHERE status = 'available' 
    ORDER BY ip_address 
    LIMIT 1;
    
    IF allocated_ip IS NOT NULL THEN
        -- Allocate the IP
        UPDATE ip_addresses 
        SET status = 'allocated',
            customer_id = p_customer_id,
            service_id = p_service_id,
            assigned_date = CURRENT_TIMESTAMP
        WHERE ip_address = allocated_ip;
        
        -- Update service with IP
        UPDATE customer_services 
        SET ip_address = allocated_ip 
        WHERE id = p_service_id;
        
        PERFORM log_activity('ip_addresses', 'ALLOCATED', allocated_ip::TEXT, 
            jsonb_build_object('customer_id', p_customer_id, 'service_id', p_service_id));
    END IF;
    
    RETURN allocated_ip;
END;
$$ LANGUAGE plpgsql;

-- Function to deallocate IP address
CREATE OR REPLACE FUNCTION deallocate_ip_address(p_service_id UUID)
RETURNS VOID AS $$
DECLARE
    deallocated_ip INET;
BEGIN
    -- Get the IP address to deallocate
    SELECT ip_address INTO deallocated_ip
    FROM customer_services 
    WHERE id = p_service_id;
    
    IF deallocated_ip IS NOT NULL THEN
        -- Deallocate the IP
        UPDATE ip_addresses 
        SET status = 'available',
            customer_id = NULL,
            service_id = NULL,
            assigned_date = NULL
        WHERE ip_address = deallocated_ip;
        
        -- Clear IP from service
        UPDATE customer_services 
        SET ip_address = NULL 
        WHERE id = p_service_id;
        
        PERFORM log_activity('ip_addresses', 'DEALLOCATED', deallocated_ip::TEXT, 
            jsonb_build_object('service_id', p_service_id));
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to handle IP allocation/deallocation
CREATE OR REPLACE FUNCTION handle_service_ip_allocation()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        -- Allocate IP for new active service
        PERFORM allocate_ip_address(NEW.customer_id, NEW.id);
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'active' AND NEW.status = 'active' THEN
            -- Service activated, allocate IP
            PERFORM allocate_ip_address(NEW.customer_id, NEW.id);
        ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
            -- Service deactivated, deallocate IP
            PERFORM deallocate_ip_address(NEW.id);
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Service deleted, deallocate IP
        PERFORM deallocate_ip_address(OLD.id);
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_service_ip_allocation 
    AFTER INSERT OR UPDATE OR DELETE ON customer_services 
    FOR EACH ROW EXECUTE FUNCTION handle_service_ip_allocation();

-- Function to generate monthly invoices
CREATE OR REPLACE FUNCTION generate_monthly_invoices()
RETURNS INTEGER AS $$
DECLARE
    service_record RECORD;
    invoice_count INTEGER := 0;
    new_invoice_id UUID;
BEGIN
    -- Generate invoices for services due for billing
    FOR service_record IN 
        SELECT cs.*, c.customer_id, c.first_name, c.last_name, sp.name as plan_name
        FROM customer_services cs
        JOIN customers c ON cs.customer_id = c.id
        JOIN service_plans sp ON cs.service_plan_id = sp.id
        WHERE cs.status = 'active' 
        AND (cs.next_billing_date IS NULL OR cs.next_billing_date <= CURRENT_DATE)
    LOOP
        -- Create invoice
        INSERT INTO invoices (customer_id, service_id, amount, total_amount, due_date, description)
        VALUES (
            service_record.customer_id,
            service_record.id,
            service_record.monthly_price,
            service_record.monthly_price,
            CURRENT_DATE + INTERVAL '30 days',
            'Monthly service fee for ' || service_record.plan_name
        ) RETURNING id INTO new_invoice_id;
        
        -- Update service billing dates
        UPDATE customer_services 
        SET last_billed_date = CURRENT_DATE,
            next_billing_date = CURRENT_DATE + INTERVAL '1 month'
        WHERE id = service_record.id;
        
        invoice_count := invoice_count + 1;
    END LOOP;
    
    PERFORM log_activity('invoices', 'BULK_GENERATE', invoice_count::TEXT, 
        jsonb_build_object('generated_count', invoice_count, 'date', CURRENT_DATE));
    
    RETURN invoice_count;
END;
$$ LANGUAGE plpgsql;

-- Function for advanced customer search
CREATE OR REPLACE FUNCTION search_customers(search_term TEXT)
RETURNS TABLE (
    id UUID,
    customer_id VARCHAR(20),
    full_name TEXT,
    email VARCHAR(255),
    phone VARCHAR(20),
    status customer_status,
    balance DECIMAL(12,2),
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.customer_id,
        c.first_name || ' ' || c.last_name as full_name,
        c.email,
        c.phone,
        c.status,
        c.balance,
        ts_rank(
            to_tsvector('english', 
                COALESCE(c.first_name, '') || ' ' || 
                COALESCE(c.last_name, '') || ' ' || 
                COALESCE(c.email, '') || ' ' || 
                COALESCE(c.phone, '') || ' ' ||
                COALESCE(c.customer_id, '')
            ),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM customers c
    WHERE 
        to_tsvector('english', 
            COALESCE(c.first_name, '') || ' ' || 
            COALESCE(c.last_name, '') || ' ' || 
            COALESCE(c.email, '') || ' ' || 
            COALESCE(c.phone, '') || ' ' ||
            COALESCE(c.customer_id, '')
        ) @@ plainto_tsquery('english', search_term)
        OR c.customer_id ILIKE '%' || search_term || '%'
        OR c.phone ILIKE '%' || search_term || '%'
        OR c.email ILIKE '%' || search_term || '%'
    ORDER BY rank DESC, c.created_at DESC;
END;
$$ LANGUAGE plpgsql;
