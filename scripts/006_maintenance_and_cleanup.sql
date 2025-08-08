-- Database Maintenance and Cleanup Procedures

-- Log cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_logs(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    temp_count INTEGER;
BEGIN
    -- Clean up system logs older than retention period
    DELETE FROM system_logs 
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * retention_days;
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    deleted_count := deleted_count + temp_count;
    
    -- Clean up audit logs (keep longer for compliance)
    DELETE FROM audit_logs 
    WHERE changed_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * (retention_days * 2);
    GET DIAGNOSTICS temp_count = ROW_COUNT;
    deleted_count := deleted_count + temp_count;
    
    -- Log the cleanup operation
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'cleanup',
        'Cleaned up ' || deleted_count || ' old log records',
        NULL,
        NULL,
        jsonb_build_object('deleted_count', deleted_count, 'retention_days', retention_days)
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Database statistics update function
CREATE OR REPLACE FUNCTION update_database_statistics()
RETURNS VOID AS $$
BEGIN
    -- Update table statistics
    ANALYZE customers;
    ANALYZE customer_services;
    ANALYZE service_plans;
    ANALYZE payments;
    ANALYZE invoices;
    ANALYZE network_routers;
    ANALYZE customer_routers;
    ANALYZE system_logs;
    ANALYZE audit_logs;
    
    -- Log the statistics update
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'maintenance',
        'Database statistics updated',
        NULL,
        NULL,
        jsonb_build_object('timestamp', CURRENT_TIMESTAMP)
    );
END;
$$ LANGUAGE plpgsql;

-- Reindex function for performance optimization
CREATE OR REPLACE FUNCTION reindex_database()
RETURNS VOID AS $$
BEGIN
    -- Reindex critical tables
    REINDEX TABLE customers;
    REINDEX TABLE customer_services;
    REINDEX TABLE payments;
    REINDEX TABLE invoices;
    REINDEX TABLE system_logs;
    
    -- Log the reindex operation
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'maintenance',
        'Database reindexing completed',
        NULL,
        NULL,
        jsonb_build_object('timestamp', CURRENT_TIMESTAMP)
    );
END;
$$ LANGUAGE plpgsql;

-- Vacuum and analyze function
CREATE OR REPLACE FUNCTION vacuum_analyze_database()
RETURNS VOID AS $$
BEGIN
    -- Vacuum and analyze all tables
    VACUUM ANALYZE customers;
    VACUUM ANALYZE customer_services;
    VACUUM ANALYZE service_plans;
    VACUUM ANALYZE payments;
    VACUUM ANALYZE invoices;
    VACUUM ANALYZE network_routers;
    VACUUM ANALYZE customer_routers;
    VACUUM ANALYZE system_logs;
    VACUUM ANALYZE audit_logs;
    
    -- Log the vacuum operation
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'maintenance',
        'Database vacuum and analyze completed',
        NULL,
        NULL,
        jsonb_build_object('timestamp', CURRENT_TIMESTAMP)
    );
END;
$$ LANGUAGE plpgsql;

-- Comprehensive maintenance function
CREATE OR REPLACE FUNCTION perform_database_maintenance()
RETURNS JSONB AS $$
DECLARE
    start_time TIMESTAMP := CURRENT_TIMESTAMP;
    end_time TIMESTAMP;
    logs_cleaned INTEGER;
    result JSONB;
BEGIN
    -- Clean up old logs
    SELECT cleanup_old_logs() INTO logs_cleaned;
    
    -- Update statistics
    PERFORM update_database_statistics();
    
    -- Vacuum and analyze
    PERFORM vacuum_analyze_database();
    
    -- Refresh materialized views
    PERFORM refresh_materialized_views();
    
    end_time := CURRENT_TIMESTAMP;
    
    -- Build result
    result := jsonb_build_object(
        'start_time', start_time,
        'end_time', end_time,
        'duration', EXTRACT(EPOCH FROM (end_time - start_time)) || ' seconds',
        'logs_cleaned', logs_cleaned,
        'status', 'completed'
    );
    
    -- Log the maintenance completion
    PERFORM log_system_event(
        'INFO'::log_level,
        'Database Maintenance',
        'maintenance',
        'Comprehensive database maintenance completed',
        NULL,
        NULL,
        result
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create maintenance schedule (to be called by cron or application scheduler)
COMMENT ON FUNCTION perform_database_maintenance() IS 'Run comprehensive database maintenance - should be scheduled daily';
COMMENT ON FUNCTION cleanup_old_logs(INTEGER) IS 'Clean up old log entries - default 90 days retention';
COMMENT ON FUNCTION update_database_statistics() IS 'Update table statistics for query optimization';
COMMENT ON FUNCTION vacuum_analyze_database() IS 'Vacuum and analyze all tables for performance';
COMMENT ON FUNCTION refresh_materialized_views() IS 'Refresh all materialized views with latest data';
