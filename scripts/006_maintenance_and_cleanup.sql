-- ISP Management System - Maintenance and Cleanup
-- This script provides maintenance functions and cleanup procedures

-- Function to clean up old logs
CREATE OR REPLACE FUNCTION cleanup_old_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM system_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * retention_days;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    PERFORM log_activity('system_logs', 'CLEANUP', deleted_count::TEXT, 
        jsonb_build_object('retention_days', retention_days, 'deleted_count', deleted_count));
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update database statistics
CREATE OR REPLACE FUNCTION update_database_statistics()
RETURNS VOID AS $$
BEGIN
    -- Update table statistics for query optimization
    ANALYZE customers;
    ANALYZE customer_services;
    ANALYZE service_plans;
    ANALYZE payments;
    ANALYZE invoices;
    ANALYZE support_tickets;
    ANALYZE network_routers;
    ANALYZE equipment_inventory;
    ANALYZE ip_addresses;
    ANALYZE system_logs;
    
    PERFORM log_activity('maintenance', 'ANALYZE', 'all_tables', 
        jsonb_build_object('analyzed_at', CURRENT_TIMESTAMP));
END;
$$ LANGUAGE plpgsql;

-- Function to reindex critical tables
CREATE OR REPLACE FUNCTION reindex_critical_tables()
RETURNS VOID AS $$
BEGIN
    -- Reindex tables that are heavily used
    REINDEX TABLE customers;
    REINDEX TABLE customer_services;
    REINDEX TABLE payments;
    REINDEX TABLE invoices;
    
    PERFORM log_activity('maintenance', 'REINDEX', 'critical_tables', 
        jsonb_build_object('reindexed_at', CURRENT_TIMESTAMP));
END;
$$ LANGUAGE plpgsql;

-- Function to vacuum and analyze database
CREATE OR REPLACE FUNCTION vacuum_analyze_database()
RETURNS VOID AS $$
BEGIN
    -- Vacuum and analyze all tables
    VACUUM ANALYZE customers;
    VACUUM ANALYZE customer_services;
    VACUUM ANALYZE service_plans;
    VACUUM ANALYZE payments;
    VACUUM ANALYZE invoices;
    VACUUM ANALYZE support_tickets;
    VACUUM ANALYZE network_routers;
    VACUUM ANALYZE equipment_inventory;
    VACUUM ANALYZE ip_addresses;
    VACUUM ANALYZE system_logs;
    
    PERFORM log_activity('maintenance', 'VACUUM_ANALYZE', 'all_tables', 
        jsonb_build_object('vacuumed_at', CURRENT_TIMESTAMP));
END;
$$ LANGUAGE plpgsql;

-- Function to check database health
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check for customers without services
    RETURN QUERY
    SELECT 
        'Customers without services'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Found ' || COUNT(*) || ' customers without active services'::TEXT
    FROM customers c
    LEFT JOIN customer_services cs ON c.id = cs.customer_id AND cs.status = 'active'
    WHERE cs.id IS NULL AND c.status = 'active';
    
    -- Check for services without IP addresses
    RETURN QUERY
    SELECT 
        'Active services without IP'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Found ' || COUNT(*) || ' active services without IP addresses'::TEXT
    FROM customer_services
    WHERE status = 'active' AND ip_address IS NULL;
    
    -- Check for overdue invoices
    RETURN QUERY
    SELECT 
        'Overdue invoices'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'INFO' END::TEXT,
        'Found ' || COUNT(*) || ' overdue invoices totaling KES ' || COALESCE(SUM(total_amount), 0)::TEXT
    FROM invoices
    WHERE status IN ('pending', 'overdue') AND due_date < CURRENT_DATE;
    
    -- Check for offline routers
    RETURN QUERY
    SELECT 
        'Offline routers'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'CRITICAL' END::TEXT,
        'Found ' || COUNT(*) || ' routers that haven''t responded in over 10 minutes'::TEXT
    FROM network_routers
    WHERE status = 'online' AND last_ping < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
    
    -- Check for equipment allocation issues
    RETURN QUERY
    SELECT 
        'Equipment allocation'::TEXT,
        CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'WARNING' END::TEXT,
        'Found ' || COUNT(*) || ' equipment items allocated to inactive customers'::TEXT
    FROM equipment_inventory ei
    JOIN customers c ON ei.allocated_to_customer = c.id
    WHERE ei.status = 'allocated' AND c.status != 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to generate database summary report
CREATE OR REPLACE FUNCTION generate_database_summary()
RETURNS TABLE (
    metric TEXT,
    value TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'Total Customers'::TEXT, COUNT(*)::TEXT FROM customers
    UNION ALL
    SELECT 'Active Customers'::TEXT, COUNT(*)::TEXT FROM customers WHERE status = 'active'
    UNION ALL
    SELECT 'Total Services'::TEXT, COUNT(*)::TEXT FROM customer_services
    UNION ALL
    SELECT 'Active Services'::TEXT, COUNT(*)::TEXT FROM customer_services WHERE status = 'active'
    UNION ALL
    SELECT 'Total Service Plans'::TEXT, COUNT(*)::TEXT FROM service_plans WHERE is_active = true
    UNION ALL
    SELECT 'Monthly Recurring Revenue'::TEXT, 'KES ' || COALESCE(SUM(monthly_price), 0)::TEXT FROM customer_services WHERE status = 'active'
    UNION ALL
    SELECT 'Pending Invoices'::TEXT, COUNT(*)::TEXT FROM invoices WHERE status = 'pending'
    UNION ALL
    SELECT 'Overdue Invoices'::TEXT, COUNT(*)::TEXT FROM invoices WHERE status = 'overdue'
    UNION ALL
    SELECT 'Total Outstanding'::TEXT, 'KES ' || COALESCE(SUM(total_amount), 0)::TEXT FROM invoices WHERE status IN ('pending', 'overdue')
    UNION ALL
    SELECT 'Open Support Tickets'::TEXT, COUNT(*)::TEXT FROM support_tickets WHERE status IN ('open', 'in_progress')
    UNION ALL
    SELECT 'Online Routers'::TEXT, COUNT(*)::TEXT FROM network_routers WHERE status = 'online'
    UNION ALL
    SELECT 'Available Equipment'::TEXT, COUNT(*)::TEXT FROM equipment_inventory WHERE status = 'available'
    UNION ALL
    SELECT 'Available IP Addresses'::TEXT, COUNT(*)::TEXT FROM ip_addresses WHERE status = 'available';
END;
$$ LANGUAGE plpgsql;

-- Comprehensive maintenance function
CREATE OR REPLACE FUNCTION run_maintenance(
    cleanup_logs BOOLEAN DEFAULT true,
    update_stats BOOLEAN DEFAULT true,
    reindex_tables BOOLEAN DEFAULT false,
    vacuum_db BOOLEAN DEFAULT false
)
RETURNS TEXT AS $$
DECLARE
    result TEXT := '';
    log_cleanup_count INTEGER;
BEGIN
    result := 'Maintenance started at ' || CURRENT_TIMESTAMP || E'\n';
    
    -- Clean up old logs
    IF cleanup_logs THEN
        SELECT cleanup_old_logs() INTO log_cleanup_count;
        result := result || 'Cleaned up ' || log_cleanup_count || ' old log entries' || E'\n';
    END IF;
    
    -- Update statistics
    IF update_stats THEN
        PERFORM update_database_statistics();
        result := result || 'Updated database statistics' || E'\n';
    END IF;
    
    -- Reindex tables
    IF reindex_tables THEN
        PERFORM reindex_critical_tables();
        result := result || 'Reindexed critical tables' || E'\n';
    END IF;
    
    -- Vacuum database
    IF vacuum_db THEN
        PERFORM vacuum_analyze_database();
        result := result || 'Vacuumed and analyzed database' || E'\n';
    END IF;
    
    -- Refresh materialized views
    PERFORM refresh_materialized_views();
    result := result || 'Refreshed materialized views' || E'\n';
    
    result := result || 'Maintenance completed at ' || CURRENT_TIMESTAMP;
    
    PERFORM log_activity('maintenance', 'RUN_MAINTENANCE', 'completed', 
        jsonb_build_object('completed_at', CURRENT_TIMESTAMP, 'summary', result));
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled maintenance log table
CREATE TABLE IF NOT EXISTS maintenance_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_type VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'running',
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to log maintenance activities
CREATE OR REPLACE FUNCTION log_maintenance(
    p_maintenance_type VARCHAR(50),
    p_details TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    maintenance_id UUID;
BEGIN
    INSERT INTO maintenance_log (maintenance_type, started_at, details)
    VALUES (p_maintenance_type, CURRENT_TIMESTAMP, p_details)
    RETURNING id INTO maintenance_id;
    
    RETURN maintenance_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete maintenance log
CREATE OR REPLACE FUNCTION complete_maintenance_log(
    p_maintenance_id UUID,
    p_status VARCHAR(20) DEFAULT 'completed',
    p_details TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    UPDATE maintenance_log 
    SET completed_at = CURRENT_TIMESTAMP,
        status = p_status,
        details = COALESCE(p_details, details)
    WHERE id = p_maintenance_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for maintenance tables
CREATE INDEX IF NOT EXISTS idx_maintenance_log_type ON maintenance_log(maintenance_type);
CREATE INDEX IF NOT EXISTS idx_maintenance_log_started ON maintenance_log(started_at);
CREATE INDEX IF NOT EXISTS idx_maintenance_log_status ON maintenance_log(status);

COMMENT ON TABLE maintenance_log IS 'Log of database maintenance activities';
COMMENT ON FUNCTION cleanup_old_logs IS 'Removes old system logs based on retention period';
COMMENT ON FUNCTION run_maintenance IS 'Comprehensive maintenance function for database optimization';
