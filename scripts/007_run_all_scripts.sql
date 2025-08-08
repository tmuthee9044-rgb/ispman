-- Master script to run all database initialization scripts
-- Run this script to set up the complete ISP management database

\echo 'Starting ISP Management Database Setup...'

-- Step 1: Initialize database with extensions and basic functions
\echo 'Step 1: Initializing database...'
\i scripts/000_initialize_database.sql

-- Step 2: Create core tables
\echo 'Step 2: Creating core tables...'
\i scripts/001_core_tables.sql

-- Step 3: Create indexes and constraints
\echo 'Step 3: Creating indexes and constraints...'
\i scripts/002_indexes_and_constraints.sql

-- Step 4: Create triggers and functions
\echo 'Step 4: Creating triggers and functions...'
\i scripts/003_triggers_and_functions.sql

-- Step 5: Create views and reports
\echo 'Step 5: Creating views and reports...'
\i scripts/004_views_and_reports.sql

-- Step 6: Insert sample data
\echo 'Step 6: Inserting sample data...'
\i scripts/005_sample_data.sql

-- Step 7: Set up maintenance procedures
\echo 'Step 7: Setting up maintenance procedures...'
\i scripts/006_maintenance_and_cleanup.sql

-- Final verification
\echo 'Verifying database setup...'

-- Check table counts
SELECT 
    'customers' as table_name, 
    COUNT(*) as record_count 
FROM customers
UNION ALL
SELECT 
    'service_plans' as table_name, 
    COUNT(*) as record_count 
FROM service_plans
UNION ALL
SELECT 
    'customer_services' as table_name, 
    COUNT(*) as record_count 
FROM customer_services
UNION ALL
SELECT 
    'payments' as table_name, 
    COUNT(*) as record_count 
FROM payments
UNION ALL
SELECT 
    'invoices' as table_name, 
    COUNT(*) as record_count 
FROM invoices
UNION ALL
SELECT 
    'network_routers' as table_name, 
    COUNT(*) as record_count 
FROM network_routers
UNION ALL
SELECT 
    'customer_routers' as table_name, 
    COUNT(*) as record_count 
FROM customer_routers;

-- Test key functions
SELECT 'Testing customer search...' as test;
SELECT * FROM search_customers('john') LIMIT 3;

SELECT 'Testing financial dashboard...' as test;
SELECT * FROM financial_dashboard;

SELECT 'Testing invoice generation...' as test;
SELECT generate_monthly_invoices() as invoices_generated;

\echo 'Database setup completed successfully!'
\echo 'You can now run the ISP management application.'
\echo ''
\echo 'To perform regular maintenance, run: SELECT perform_database_maintenance();'
\echo 'To clean up old logs, run: SELECT cleanup_old_logs(90);'
\echo 'To refresh materialized views, run: SELECT refresh_materialized_views();'
