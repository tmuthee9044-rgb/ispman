-- Views and Reports for ISP Management System

-- Customer summary view
CREATE OR REPLACE VIEW customer_summary AS
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
    c.account_balance,
    c.created_at,
    
    -- Service information
    COUNT(cs.id) as total_services,
    COUNT(cs.id) FILTER (WHERE cs.status = 'active') as active_services,
    SUM(cs.monthly_fee) FILTER (WHERE cs.status = 'active') as monthly_revenue,
    
    -- Payment information
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed'), 0) as total_payments,
    MAX(p.payment_date) FILTER (WHERE p.status = 'completed') as last_payment_date,
    
    -- Invoice information
    COUNT(i.id) as total_invoices,
    COUNT(i.id) FILTER (WHERE i.status = 'overdue') as overdue_invoices,
    COALESCE(SUM(i.balance_due) FILTER (WHERE i.status IN ('pending', 'overdue')), 0) as outstanding_balance

FROM customers c
LEFT JOIN customer_services cs ON c.id = cs.customer_id
LEFT JOIN payments p ON c.id = p.customer_id
LEFT JOIN invoices i ON c.id = i.customer_id
GROUP BY c.id, c.customer_id, c.first_name, c.last_name, c.company_name, 
         c.email, c.phone, c.status, c.account_balance, c.created_at;

-- Service performance view
CREATE OR REPLACE VIEW service_performance AS
SELECT 
    sp.id,
    sp.name,
    sp.plan_code,
    sp.monthly_fee,
    sp.speed_down,
    sp.speed_up,
    
    -- Subscription metrics
    COUNT(cs.id) as total_subscriptions,
    COUNT(cs.id) FILTER (WHERE cs.status = 'active') as active_subscriptions,
    COUNT(cs.id) FILTER (WHERE cs.status = 'suspended') as suspended_subscriptions,
    
    -- Revenue metrics
    SUM(cs.monthly_fee) FILTER (WHERE cs.status = 'active') as monthly_revenue,
    AVG(cs.monthly_fee) as avg_monthly_fee,
    
    -- Customer satisfaction (based on service status)
    ROUND(
        (COUNT(cs.id) FILTER (WHERE cs.status = 'active')::DECIMAL / 
         NULLIF(COUNT(cs.id), 0)) * 100, 2
    ) as retention_rate

FROM service_plans sp
LEFT JOIN customer_services cs ON sp.id = cs.service_plan_id
WHERE sp.active = true
GROUP BY sp.id, sp.name, sp.plan_code, sp.monthly_fee, sp.speed_down, sp.speed_up
ORDER BY active_subscriptions DESC;

-- Financial dashboard view
CREATE OR REPLACE VIEW financial_dashboard AS
SELECT 
    -- Revenue metrics
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed' AND p.payment_date >= CURRENT_DATE - INTERVAL '30 days'), 0) as revenue_last_30_days,
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed' AND EXTRACT(MONTH FROM p.payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)), 0) as revenue_current_month,
    COALESCE(SUM(p.amount) FILTER (WHERE p.status = 'completed' AND EXTRACT(YEAR FROM p.payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)), 0) as revenue_current_year,
    
    -- Outstanding amounts
    COALESCE(SUM(i.balance_due) FILTER (WHERE i.status = 'pending'), 0) as pending_invoices,
    COALESCE(SUM(i.balance_due) FILTER (WHERE i.status = 'overdue'), 0) as overdue_invoices,
    COALESCE(SUM(i.balance_due) FILTER (WHERE i.status IN ('pending', 'overdue')), 0) as total_outstanding,
    
    -- Customer metrics
    COUNT(DISTINCT c.id) as total_customers,
    COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') as active_customers,
    COUNT(DISTINCT cs.id) FILTER (WHERE cs.status = 'active') as active_services,
    
    -- Average metrics
    ROUND(AVG(cs.monthly_fee) FILTER (WHERE cs.status = 'active'), 2) as avg_monthly_fee,
    ROUND(AVG(c.account_balance), 2) as avg_account_balance

FROM customers c
LEFT JOIN customer_services cs ON c.id = cs.customer_id
LEFT JOIN payments p ON c.id = p.customer_id
LEFT JOIN invoices i ON c.id = i.customer_id;

-- Network status view
CREATE OR REPLACE VIEW network_status AS
SELECT 
    nr.id,
    nr.name,
    nr.router_type,
    nr.ip_address,
    nr.location,
    nr.status,
    nr.cpu_load,
    nr.memory_usage,
    nr.bandwidth_usage,
    nr.uptime,
    nr.last_ping,
    
    -- Connected services
    COUNT(cs.id) as connected_services,
    COUNT(cs.id) FILTER (WHERE cs.status = 'active') as active_connections,
    
    -- Performance indicators
    CASE 
        WHEN nr.cpu_load > 90 THEN 'Critical'
        WHEN nr.cpu_load > 75 THEN 'Warning'
        ELSE 'Normal'
    END as cpu_status,
    
    CASE 
        WHEN nr.memory_usage > 90 THEN 'Critical'
        WHEN nr.memory_usage > 75 THEN 'Warning'
        ELSE 'Normal'
    END as memory_status,
    
    CASE 
        WHEN nr.last_ping < CURRENT_TIMESTAMP - INTERVAL '5 minutes' THEN 'Offline'
        WHEN nr.last_ping < CURRENT_TIMESTAMP - INTERVAL '1 minute' THEN 'Warning'
        ELSE 'Online'
    END as connectivity_status

FROM network_routers nr
LEFT JOIN customer_services cs ON nr.id = cs.network_router_id
GROUP BY nr.id, nr.name, nr.router_type, nr.ip_address, nr.location, 
         nr.status, nr.cpu_load, nr.memory_usage, nr.bandwidth_usage, 
         nr.uptime, nr.last_ping
ORDER BY nr.name;

-- Payment summary view
CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    DATE_TRUNC('month', p.payment_date) as payment_month,
    p.payment_method,
    COUNT(*) as transaction_count,
    SUM(p.amount) as total_amount,
    AVG(p.amount) as avg_amount,
    MIN(p.amount) as min_amount,
    MAX(p.amount) as max_amount,
    
    -- Success rate
    ROUND(
        (COUNT(*) FILTER (WHERE p.status = 'completed')::DECIMAL / COUNT(*)) * 100, 2
    ) as success_rate

FROM payments p
WHERE p.payment_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', p.payment_date), p.payment_method
ORDER BY payment_month DESC, p.payment_method;

-- Customer activity view
CREATE OR REPLACE VIEW customer_activity AS
SELECT 
    c.id,
    c.customer_id,
    CASE 
        WHEN c.company_name IS NOT NULL THEN c.company_name
        ELSE c.first_name || ' ' || COALESCE(c.last_name, '')
    END as full_name,
    c.status,
    c.last_login,
    
    -- Recent activity
    MAX(p.payment_date) as last_payment,
    MAX(i.invoice_date) as last_invoice,
    COUNT(sl.id) FILTER (WHERE sl.timestamp >= CURRENT_DATE - INTERVAL '30 days') as recent_activities,
    
    -- Service status
    COUNT(cs.id) FILTER (WHERE cs.status = 'active') as active_services,
    COUNT(cs.id) FILTER (WHERE cs.status = 'suspended') as suspended_services,
    
    -- Account health
    c.account_balance,
    COALESCE(SUM(i.balance_due) FILTER (WHERE i.status IN ('pending', 'overdue')), 0) as outstanding_balance,
    
    -- Activity score (0-100)
    CASE 
        WHEN c.last_login >= CURRENT_DATE - INTERVAL '7 days' THEN 100
        WHEN c.last_login >= CURRENT_DATE - INTERVAL '30 days' THEN 75
        WHEN c.last_login >= CURRENT_DATE - INTERVAL '90 days' THEN 50
        WHEN c.last_login IS NOT NULL THEN 25
        ELSE 0
    END as activity_score

FROM customers c
LEFT JOIN customer_services cs ON c.id = cs.customer_id
LEFT JOIN payments p ON c.id = p.customer_id
LEFT JOIN invoices i ON c.id = i.customer_id
LEFT JOIN system_logs sl ON c.id = sl.customer_id
GROUP BY c.id, c.customer_id, c.first_name, c.last_name, c.company_name, 
         c.status, c.last_login, c.account_balance
ORDER BY activity_score DESC, c.last_login DESC;

-- Equipment utilization view
CREATE OR REPLACE VIEW equipment_utilization AS
SELECT 
    cr.equipment_type,
    cr.brand,
    cr.model,
    COUNT(*) as total_units,
    COUNT(*) FILTER (WHERE cr.status = 'available') as available_units,
    COUNT(*) FILTER (WHERE cr.status = 'allocated') as allocated_units,
    COUNT(*) FILTER (WHERE cr.status = 'maintenance') as maintenance_units,
    COUNT(*) FILTER (WHERE cr.status = 'damaged') as damaged_units,
    
    -- Utilization rate
    ROUND(
        (COUNT(*) FILTER (WHERE cr.status = 'allocated')::DECIMAL / COUNT(*)) * 100, 2
    ) as utilization_rate,
    
    -- Average age
    ROUND(AVG(EXTRACT(DAYS FROM CURRENT_DATE - cr.purchase_date)) / 365.25, 1) as avg_age_years,
    
    -- Total value
    SUM(cr.purchase_price) as total_purchase_value,
    AVG(cr.purchase_price) as avg_purchase_price

FROM customer_routers cr
GROUP BY cr.equipment_type, cr.brand, cr.model
ORDER BY utilization_rate DESC, total_units DESC;

-- Monthly revenue report view
CREATE OR REPLACE VIEW monthly_revenue_report AS
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    EXTRACT(YEAR FROM payment_date) as year,
    EXTRACT(MONTH FROM payment_date) as month_num,
    TO_CHAR(payment_date, 'Month YYYY') as month_name,
    
    -- Payment metrics
    COUNT(*) as total_transactions,
    SUM(amount) as total_revenue,
    AVG(amount) as avg_transaction,
    
    -- Payment methods breakdown
    SUM(amount) FILTER (WHERE payment_method = 'M-Pesa') as mpesa_revenue,
    SUM(amount) FILTER (WHERE payment_method = 'Airtel Money') as airtel_revenue,
    SUM(amount) FILTER (WHERE payment_method = 'Bank Transfer') as bank_revenue,
    SUM(amount) FILTER (WHERE payment_method = 'Cash') as cash_revenue,
    
    -- Growth metrics
    LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', payment_date)) as previous_month_revenue,
    ROUND(
        ((SUM(amount) - LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', payment_date))) / 
         NULLIF(LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', payment_date)), 0)) * 100, 2
    ) as growth_rate

FROM payments
WHERE status = 'completed'
AND payment_date >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY DATE_TRUNC('month', payment_date), EXTRACT(YEAR FROM payment_date), EXTRACT(MONTH FROM payment_date)
ORDER BY month DESC;

-- Create materialized views for better performance on large datasets
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_customer_summary AS
SELECT * FROM customer_summary;

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_financial_dashboard AS
SELECT * FROM financial_dashboard;

-- Create indexes on materialized views
CREATE INDEX IF NOT EXISTS idx_mv_customer_summary_status ON mv_customer_summary(status);
CREATE INDEX IF NOT EXISTS idx_mv_customer_summary_balance ON mv_customer_summary(account_balance);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mv_customer_summary;
    REFRESH MATERIALIZED VIEW mv_financial_dashboard;
    
    -- Log the refresh
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'system',
        'Materialized views refreshed',
        NULL,
        NULL,
        jsonb_build_object('timestamp', CURRENT_TIMESTAMP)
    );
END;
$$ LANGUAGE plpgsql;
