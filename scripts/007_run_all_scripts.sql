-- ISP Management System - Master Setup Script
-- This script runs all database setup scripts in the correct order

\echo 'Starting ISP Management System Database Setup...'
\echo '================================================='

\echo ''
\echo 'Step 1/7: Initializing database with extensions and types...'
\i scripts/000_initialize_database.sql
\echo '✓ Database initialization completed'

\echo ''
\echo 'Step 2/7: Creating core tables...'
\i scripts/001_core_tables.sql
\echo '✓ Core tables created'

\echo ''
\echo 'Step 3/7: Adding indexes and constraints...'
\i scripts/002_indexes_and_constraints.sql
\echo '✓ Indexes and constraints added'

\echo ''
\echo 'Step 4/7: Creating triggers and functions...'
\i scripts/003_triggers_and_functions.sql
\echo '✓ Triggers and functions created'

\echo ''
\echo 'Step 5/7: Creating views and reports...'
\i scripts/004_views_and_reports.sql
\echo '✓ Views and reports created'

\echo ''
\echo 'Step 6/7: Inserting sample data...'
\i scripts/005_sample_data.sql
\echo '✓ Sample data inserted'

\echo ''
\echo 'Step 7/7: Setting up maintenance procedures...'
\i scripts/006_maintenance_and_cleanup.sql
\echo '✓ Maintenance procedures created'

\echo ''
\echo '================================================='
\echo 'Database Setup Verification'
\echo '================================================='

-- Verify setup by showing record counts
\echo ''
\echo 'Record counts:'
SELECT 'Customers' as table_name, COUNT(*) as records FROM customers
UNION ALL
SELECT 'Service Plans', COUNT(*) FROM service_plans
UNION ALL
SELECT 'Customer Services', COUNT(*) FROM customer_services
UNION ALL
SELECT 'Network Routers', COUNT(*) FROM network_routers
UNION ALL
SELECT 'Equipment Inventory', COUNT(*) FROM equipment_inventory
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Support Tickets', COUNT(*) FROM support_tickets
UNION ALL
SELECT 'IP Addresses', COUNT(*) FROM ip_addresses
ORDER BY table_name;

\echo ''
\echo 'Financial Summary:'
SELECT * FROM financial_dashboard;

\echo ''
\echo 'Testing key functions:'
-- Test customer search function
SELECT 'Customer Search Test' as test_name, COUNT(*) as results 
FROM search_customers('John');

-- Test balance calculation
SELECT 'Balance Calculation Test' as test_name, 
       CASE WHEN calculate_customer_balance((SELECT id FROM customers LIMIT 1)) IS NOT NULL 
            THEN 'PASSED' ELSE 'FAILED' END as result;

-- Test database health check
\echo ''
\echo 'Database Health Check:'
SELECT * FROM check_database_health();

\echo ''
\echo '================================================='
\echo '🎉 ISP Management System Database Setup Complete!'
\echo '================================================='
\echo ''
\echo 'Your database is now ready with:'
\echo '• Complete table structure with proper relationships'
\echo '• Performance-optimized indexes and constraints'
\echo '• Business logic functions and triggers'
\echo '• Comprehensive reporting views'
\echo '• Sample data for testing (8 customers, 8 service plans, etc.)'
\echo '• Automated maintenance procedures'
\echo ''
\echo 'Next steps:'
\echo '1. Start your Next.js application'
\echo '2. Configure your environment variables'
\echo '3. Access the web interface at http://localhost:3000'
\echo ''
\echo 'For ongoing maintenance, run: SELECT run_maintenance();'
\echo 'For database health checks, run: SELECT * FROM check_database_health();'
\echo ''
\echo 'Happy managing! 🚀'
