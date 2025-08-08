-- Master script to run all database setup scripts in order
-- This ensures proper initialization of the ISP Management System database

\echo 'Starting ISP Management System Database Setup...'

-- Set client encoding and timezone
SET client_encoding = 'UTF8';
SET timezone = 'Africa/Nairobi';

-- Run initialization script
\echo 'Running 000_initialize_database.sql...'
\i /docker-entrypoint-initdb.d/000_initialize_database.sql

-- Run core tables script
\echo 'Running 001_core_tables.sql...'
\i /docker-entrypoint-initdb.d/001_core_tables.sql

-- Run indexes and constraints script
\echo 'Running 002_indexes_and_constraints.sql...'
\i /docker-entrypoint-initdb.d/002_indexes_and_constraints.sql

-- Run triggers and functions script
\echo 'Running 003_triggers_and_functions.sql...'
\i /docker-entrypoint-initdb.d/003_triggers_and_functions.sql

-- Run views and reports script
\echo 'Running 004_views_and_reports.sql...'
\i /docker-entrypoint-initdb.d/004_views_and_reports.sql

-- Run sample data script
\echo 'Running 005_sample_data.sql...'
\i /docker-entrypoint-initdb.d/005_sample_data.sql

-- Run maintenance and cleanup script
\echo 'Running 006_maintenance_and_cleanup.sql...'
\i /docker-entrypoint-initdb.d/006_maintenance_and_cleanup.sql

-- Verify database setup
\echo 'Verifying database setup...'

-- Check if all main tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
    
    IF table_count >= 30 THEN
        RAISE NOTICE 'Database setup successful! Created % tables.', table_count;
    ELSE
        RAISE EXCEPTION 'Database setup incomplete. Only % tables created.', table_count;
    END IF;
END $$;

-- Check sample data
DO $$
DECLARE
    customer_count INTEGER;
    service_count INTEGER;
    router_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO customer_count FROM customers;
    SELECT COUNT(*) INTO service_count FROM service_plans;
    SELECT COUNT(*) INTO router_count FROM routers;
    
    RAISE NOTICE 'Sample data loaded: % customers, % service plans, % routers', 
                 customer_count, service_count, router_count;
END $$;

-- Final success message
\echo ''
\echo '🎉 ISP Management System Database Setup Complete!'
\echo '================================================='
\echo ''
\echo 'Database Features:'
\echo '✓ Complete table structure with relationships'
\echo '✓ Optimized indexes for performance'
\echo '✓ Audit logging and triggers'
\echo '✓ Sample data for immediate testing'
\echo '✓ Views and reports for analytics'
\echo '✓ Maintenance and cleanup procedures'
\echo ''
\echo 'Ready to connect your ISP Management System!'
\echo ''
