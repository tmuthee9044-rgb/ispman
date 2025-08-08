-- Triggers and Functions for ISP Management System

-- Update timestamp triggers
CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_plans_updated_at 
    BEFORE UPDATE ON service_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_services_updated_at 
    BEFORE UPDATE ON customer_services 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_network_routers_updated_at 
    BEFORE UPDATE ON network_routers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_routers_updated_at 
    BEFORE UPDATE ON customer_routers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Audit triggers for sensitive tables
CREATE TRIGGER audit_customers_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_payments_trigger
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_customer_services_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customer_services
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Business logic functions
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate tax amount
    NEW.tax_amount = NEW.subtotal * NEW.tax_rate;
    
    -- Calculate total amount
    NEW.total_amount = NEW.subtotal + NEW.tax_amount - NEW.discount_amount;
    
    -- Calculate balance due
    NEW.balance_due = NEW.total_amount - NEW.paid_amount;
    
    -- Update status based on balance
    IF NEW.balance_due <= 0 THEN
        NEW.status = 'paid';
        NEW.paid_date = CURRENT_DATE;
    ELSIF NEW.due_date < CURRENT_DATE AND NEW.balance_due > 0 THEN
        NEW.status = 'overdue';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_invoice_totals_trigger
    BEFORE INSERT OR UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

-- Customer account balance management
CREATE OR REPLACE FUNCTION update_customer_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
        -- Add payment to customer balance
        UPDATE customers 
        SET account_balance = account_balance + NEW.amount
        WHERE id = NEW.customer_id;
        
        -- Log the transaction
        PERFORM log_system_event(
            'INFO'::log_level,
            'Payment System',
            'payment',
            'Payment of KES ' || NEW.amount || ' added to customer balance',
            NULL,
            NEW.customer_id::TEXT,
            jsonb_build_object('payment_id', NEW.id, 'amount', NEW.amount)
        );
        
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
        -- Payment confirmed, add to balance
        UPDATE customers 
        SET account_balance = account_balance + NEW.amount
        WHERE id = NEW.customer_id;
        
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'completed' AND NEW.status != 'completed' THEN
        -- Payment reversed, subtract from balance
        UPDATE customers 
        SET account_balance = account_balance - OLD.amount
        WHERE id = OLD.customer_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_balance_trigger
    AFTER INSERT OR UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_customer_balance();

-- Service status management
CREATE OR REPLACE FUNCTION manage_service_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-activate service when payment is received
    IF TG_OP = 'UPDATE' AND OLD.status = 'pending' AND NEW.status = 'active' THEN
        NEW.activation_date = CURRENT_DATE;
        
        -- Calculate next billing date
        NEW.next_billing_date = CURRENT_DATE + INTERVAL '1 month';
        
        -- Log activation
        PERFORM log_system_event(
            'INFO'::log_level,
            'Service Management',
            'service',
            'Service activated for customer ' || NEW.customer_id,
            NULL,
            NEW.customer_id::TEXT,
            jsonb_build_object('service_id', NEW.id, 'plan_id', NEW.service_plan_id)
        );
    END IF;
    
    -- Handle service suspension
    IF TG_OP = 'UPDATE' AND OLD.status != 'suspended' AND NEW.status = 'suspended' THEN
        NEW.suspension_date = CURRENT_DATE;
        
        -- Log suspension
        PERFORM log_system_event(
            'WARNING'::log_level,
            'Service Management',
            'service',
            'Service suspended for customer ' || NEW.customer_id,
            NULL,
            NEW.customer_id::TEXT,
            jsonb_build_object('service_id', NEW.id, 'reason', NEW.suspension_reason)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_service_status_trigger
    BEFORE UPDATE ON customer_services
    FOR EACH ROW EXECUTE FUNCTION manage_service_status();

-- Equipment allocation management
CREATE OR REPLACE FUNCTION manage_equipment_allocation()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.allocated_to_customer IS DISTINCT FROM NEW.allocated_to_customer THEN
        IF NEW.allocated_to_customer IS NOT NULL THEN
            -- Equipment allocated
            NEW.status = 'allocated';
            NEW.allocation_date = CURRENT_TIMESTAMP;
            
            -- Log allocation
            PERFORM log_system_event(
                'INFO'::log_level,
                'Equipment Management',
                'equipment',
                'Equipment ' || NEW.serial_number || ' allocated to customer ' || NEW.allocated_to_customer,
                NULL,
                NEW.allocated_to_customer::TEXT,
                jsonb_build_object('equipment_id', NEW.id, 'serial_number', NEW.serial_number)
            );
        ELSE
            -- Equipment deallocated
            NEW.status = 'available';
            NEW.allocation_date = NULL;
            
            -- Log deallocation
            PERFORM log_system_event(
                'INFO'::log_level,
                'Equipment Management',
                'equipment',
                'Equipment ' || NEW.serial_number || ' returned to inventory',
                NULL,
                OLD.allocated_to_customer::TEXT,
                jsonb_build_object('equipment_id', NEW.id, 'serial_number', NEW.serial_number)
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_equipment_allocation_trigger
    BEFORE UPDATE ON customer_routers
    FOR EACH ROW EXECUTE FUNCTION manage_equipment_allocation();

-- Automatic invoice generation
CREATE OR REPLACE FUNCTION generate_monthly_invoices()
RETURNS INTEGER AS $$
DECLARE
    service_record RECORD;
    invoice_id INTEGER;
    line_items JSONB;
    total_invoices INTEGER := 0;
BEGIN
    -- Generate invoices for services due for billing
    FOR service_record IN 
        SELECT cs.*, c.first_name, c.last_name, c.email, sp.name as plan_name
        FROM customer_services cs
        JOIN customers c ON cs.customer_id = c.id
        JOIN service_plans sp ON cs.service_plan_id = sp.id
        WHERE cs.status = 'active'
        AND cs.next_billing_date <= CURRENT_DATE
        AND cs.auto_renew = true
    LOOP
        -- Create line items
        line_items := jsonb_build_array(
            jsonb_build_object(
                'description', service_record.plan_name || ' - Monthly Service',
                'quantity', 1,
                'unit_price', service_record.monthly_fee,
                'total', service_record.monthly_fee
            )
        );
        
        -- Create invoice
        INSERT INTO invoices (
            customer_id,
            subtotal,
            total_amount,
            balance_due,
            due_date,
            line_items,
            billing_period_start,
            billing_period_end
        ) VALUES (
            service_record.customer_id,
            service_record.monthly_fee,
            service_record.monthly_fee * 1.16, -- Including 16% VAT
            service_record.monthly_fee * 1.16,
            CURRENT_DATE + INTERVAL '30 days',
            line_items,
            service_record.next_billing_date,
            service_record.next_billing_date + INTERVAL '1 month'
        ) RETURNING id INTO invoice_id;
        
        -- Update next billing date
        UPDATE customer_services 
        SET next_billing_date = next_billing_date + INTERVAL '1 month'
        WHERE id = service_record.id;
        
        total_invoices := total_invoices + 1;
        
        -- Log invoice generation
        PERFORM log_system_event(
            'INFO'::log_level,
            'Billing System',
            'billing',
            'Monthly invoice generated for customer ' || service_record.customer_id,
            NULL,
            service_record.customer_id::TEXT,
            jsonb_build_object('invoice_id', invoice_id, 'amount', service_record.monthly_fee * 1.16)
        );
    END LOOP;
    
    RETURN total_invoices;
END;
$$ LANGUAGE plpgsql;

-- Customer search function
CREATE OR REPLACE FUNCTION search_customers(search_term TEXT)
RETURNS TABLE (
    id INTEGER,
    customer_id VARCHAR(20),
    full_name TEXT,
    email VARCHAR(255),
    phone VARCHAR(50),
    status customer_status,
    account_balance DECIMAL(15,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.customer_id,
        CASE 
            WHEN c.company_name IS NOT NULL THEN c.company_name
            ELSE c.first_name || ' ' || COALESCE(c.last_name, '')
        END as full_name,
        c.email,
        c.phone,
        c.status,
        c.account_balance
    FROM customers c
    WHERE 
        c.first_name ILIKE '%' || search_term || '%'
        OR c.last_name ILIKE '%' || search_term || '%'
        OR c.company_name ILIKE '%' || search_term || '%'
        OR c.email ILIKE '%' || search_term || '%'
        OR c.phone ILIKE '%' || search_term || '%'
        OR c.customer_id ILIKE '%' || search_term || '%'
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Payment processing function
CREATE OR REPLACE FUNCTION process_payment(
    p_customer_id INTEGER,
    p_amount DECIMAL(15,2),
    p_payment_method VARCHAR(100),
    p_transaction_id VARCHAR(255),
    p_reference_number VARCHAR(255) DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    payment_id INTEGER;
BEGIN
    -- Insert payment record
    INSERT INTO payments (
        customer_id,
        amount,
        payment_method,
        transaction_id,
        reference_number,
        status,
        payment_date
    ) VALUES (
        p_customer_id,
        p_amount,
        p_payment_method,
        p_transaction_id,
        p_reference_number,
        'completed',
        CURRENT_TIMESTAMP
    ) RETURNING id INTO payment_id;
    
    -- Log payment processing
    PERFORM log_system_event(
        'INFO'::log_level,
        'Payment Gateway',
        'payment',
        'Payment processed: KES ' || p_amount || ' via ' || p_payment_method,
        NULL,
        p_customer_id::TEXT,
        jsonb_build_object(
            'payment_id', payment_id,
            'amount', p_amount,
            'method', p_payment_method,
            'transaction_id', p_transaction_id
        )
    );
    
    RETURN payment_id;
END;
$$ LANGUAGE plpgsql;
