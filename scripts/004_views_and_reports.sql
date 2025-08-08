-- ISP Management System - Views and Reports
-- This script creates views for reporting and dashboard functionality

-- Customer summary view
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.customer_id,
    c.first_name || ' ' || c.last_name as full_name,
    c.email,
    c.phone,
    c.status,
    c.balance,
    c.created_at,
    COUNT(cs.id) as active_services,
    COALESCE(SUM(cs.monthly_price), 0) as monthly_revenue,
    (SELECT COUNT(*) FROM support_tickets st WHERE st.customer_id = c.id AND st.status IN ('open', 'in_progress')) as open_tickets,
    (SELECT COUNT(*) FROM invoices i WHERE i.customer_id = c.id AND i.status = 'pending') as pending_invoices,
    (SELECT SUM(i.total_amount) FROM invoices i WHERE i.customer_id = c.id AND i.status IN ('pending', 'overdue')) as outstanding_amount
FROM customers c
LEFT JOIN customer_services cs ON c.id = cs.customer_id AND cs.status = 'active'
GROUP BY c.id, c.customer_id, c.first_name, c.last_name, c.email, c.phone, c.status, c.balance, c.created_at;

-- Financial dashboard view
CREATE VIEW financial_dashboard AS
SELECT 
    (SELECT COUNT(*) FROM customers WHERE status = 'active') as active_customers,
    (SELECT COUNT(*) FROM customer_services WHERE status = 'active') as active_services,
    (SELECT COALESCE(SUM(monthly_price), 0) FROM customer_services WHERE status = 'active') as monthly_recurring_revenue,
    (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE status = 'pending') as pending_invoices_amount,
    (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE status = 'overdue') as overdue_invoices_amount,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND payment_date >= CURRENT_DATE - INTERVAL '30 days') as payments_last_30_days,
    (SELECT COUNT(*) FROM support_tickets WHERE status IN ('open', 'in_progress')) as open_support_tickets;

-- Service plan performance view
CREATE VIEW service_plan_performance AS
SELECT 
    sp.id,
    sp.name,
    sp.monthly_price,
    sp.download_speed,
    sp.upload_speed,
    COUNT(cs.id) as active_subscriptions,
    COALESCE(SUM(cs.monthly_price), 0) as total_monthly_revenue,
    AVG(EXTRACT(DAYS FROM (COALESCE(cs.termination_date, CURRENT_DATE) - cs.activation_date))) as avg_subscription_days,
    (COUNT(cs.id) * 100.0 / NULLIF((SELECT COUNT(*) FROM customer_services WHERE status IN ('active', 'suspended', 'terminated')), 0)) as market_share_percentage
FROM service_plans sp
LEFT JOIN customer_services cs ON sp.id = cs.service_plan_id AND cs.status = 'active'
WHERE sp.is_active = true
GROUP BY sp.id, sp.name, sp.monthly_price, sp.download_speed, sp.upload_speed
ORDER BY active_subscriptions DESC;

-- Network status overview
CREATE VIEW network_status_overview AS
SELECT 
    nr.id,
    nr.name,
    nr.ip_address,
    nr.location,
    nr.status,
    nr.last_ping,
    nr.uptime_seconds,
    nr.cpu_usage,
    nr.memory_usage,
    CASE 
        WHEN nr.last_ping > CURRENT_TIMESTAMP - INTERVAL '5 minutes' THEN 'Online'
        WHEN nr.last_ping > CURRENT_TIMESTAMP - INTERVAL '1 hour' THEN 'Warning'
        ELSE 'Offline'
    END as health_status,
    COUNT(cs.id) as connected_customers
FROM network_routers nr
LEFT JOIN customer_services cs ON nr.id = cs.router_id AND cs.status = 'active'
GROUP BY nr.id, nr.name, nr.ip_address, nr.location, nr.status, nr.last_ping, nr.uptime_seconds, nr.cpu_usage, nr.memory_usage;

-- Payment analytics view
CREATE VIEW payment_analytics AS
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    payment_method,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_transactions,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
    (COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as success_rate
FROM payments 
WHERE payment_date >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', payment_date), payment_method
ORDER BY month DESC, payment_method;

-- Customer service history view
CREATE VIEW customer_service_history AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name as customer_name,
    sp.name as service_plan,
    cs.status,
    cs.activation_date,
    cs.suspension_date,
    cs.termination_date,
    cs.monthly_price,
    cs.ip_address,
    EXTRACT(DAYS FROM (COALESCE(cs.termination_date, CURRENT_DATE) - cs.activation_date)) as service_duration_days,
    (cs.monthly_price * EXTRACT(DAYS FROM (COALESCE(cs.termination_date, CURRENT_DATE) - cs.activation_date)) / 30.0) as total_revenue
FROM customer_services cs
JOIN customers c ON cs.customer_id = c.id
JOIN service_plans sp ON cs.service_plan_id = sp.id
ORDER BY cs.activation_date DESC;

-- Equipment utilization view
CREATE VIEW equipment_utilization AS
SELECT 
    equipment_type,
    brand,
    model,
    COUNT(*) as total_units,
    COUNT(CASE WHEN status = 'available' THEN 1 END) as available_units,
    COUNT(CASE WHEN status = 'allocated' THEN 1 END) as allocated_units,
    COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_units,
    COUNT(CASE WHEN status = 'faulty' THEN 1 END) as faulty_units,
    (COUNT(CASE WHEN status = 'allocated' THEN 1 END) * 100.0 / COUNT(*)) as utilization_percentage
FROM equipment_inventory
GROUP BY equipment_type, brand, model
ORDER BY utilization_percentage DESC;

-- Create materialized views for better performance on large datasets
CREATE MATERIALIZED VIEW mv_monthly_revenue AS
SELECT 
    DATE_TRUNC('month', p.payment_date) as month,
    COUNT(DISTINCT p.customer_id) as paying_customers,
    COUNT(p.id) as total_payments,
    SUM(p.amount) as total_revenue,
    AVG(p.amount) as average_payment,
    SUM(CASE WHEN p.payment_method = 'mpesa' THEN p.amount ELSE 0 END) as mpesa_revenue,
    SUM(CASE WHEN p.payment_method = 'airtel_money' THEN p.amount ELSE 0 END) as airtel_revenue,
    SUM(CASE WHEN p.payment_method = 'bank_transfer' THEN p.amount ELSE 0 END) as bank_revenue
FROM payments p
WHERE p.status = 'completed' 
AND p.payment_date >= CURRENT_DATE - INTERVAL '24 months'
GROUP BY DATE_TRUNC('month', p.payment_date)
ORDER BY month;

-- Create indexes on materialized views
CREATE INDEX idx_mv_monthly_revenue_month ON mv_monthly_revenue(month);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mv_monthly_revenue;
    PERFORM log_activity('materialized_views', 'REFRESH', 'mv_monthly_revenue', 
        jsonb_build_object('refreshed_at', CURRENT_TIMESTAMP));
END;
$$ LANGUAGE plpgsql;

-- Create a view for overdue accounts
CREATE VIEW overdue_accounts AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name as customer_name,
    c.email,
    c.phone,
    c.balance,
    COUNT(i.id) as overdue_invoices,
    SUM(i.total_amount) as total_overdue_amount,
    MIN(i.due_date) as oldest_due_date,
    MAX(i.due_date) as newest_due_date,
    EXTRACT(DAYS FROM (CURRENT_DATE - MIN(i.due_date))) as days_overdue
FROM customers c
JOIN invoices i ON c.id = i.customer_id
WHERE i.status = 'overdue' OR (i.status = 'pending' AND i.due_date < CURRENT_DATE)
GROUP BY c.id, c.customer_id, c.first_name, c.last_name, c.email, c.phone, c.balance
ORDER BY total_overdue_amount DESC;

-- Support ticket analytics view
CREATE VIEW support_ticket_analytics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    priority,
    status,
    COUNT(*) as ticket_count,
    AVG(EXTRACT(HOURS FROM (COALESCE(resolved_at, CURRENT_TIMESTAMP) - created_at))) as avg_resolution_hours,
    COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) as resolved_tickets,
    (COUNT(CASE WHEN resolved_at IS NOT NULL THEN 1 END) * 100.0 / COUNT(*)) as resolution_rate
FROM support_tickets
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at), priority, status
ORDER BY month DESC, priority, status;
