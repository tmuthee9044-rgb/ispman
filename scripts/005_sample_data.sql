-- ISP Management System - Sample Data
-- This script inserts sample data for testing and demonstration

-- Insert sample service plans
INSERT INTO service_plans (name, description, download_speed, upload_speed, data_limit, monthly_price, setup_fee, features) VALUES
('Basic Home', 'Perfect for light browsing and email', 5, 1, NULL, 1500.00, 2000.00, '{"wifi_included": true, "support_level": "basic", "static_ip": false}'),
('Standard Home', 'Great for streaming and video calls', 10, 2, NULL, 2500.00, 2000.00, '{"wifi_included": true, "support_level": "standard", "static_ip": false}'),
('Premium Home', 'High-speed for multiple devices', 25, 5, NULL, 4000.00, 2500.00, '{"wifi_included": true, "support_level": "premium", "static_ip": true}'),
('Business Starter', 'Reliable connection for small business', 15, 3, NULL, 3500.00, 3000.00, '{"wifi_included": true, "support_level": "business", "static_ip": true, "priority_support": true}'),
('Business Pro', 'High-performance for growing business', 50, 10, NULL, 7500.00, 5000.00, '{"wifi_included": true, "support_level": "business", "static_ip": true, "priority_support": true, "backup_connection": true}'),
('Enterprise', 'Dedicated connection for large organizations', 100, 20, NULL, 15000.00, 10000.00, '{"wifi_included": true, "support_level": "enterprise", "static_ip": true, "priority_support": true, "backup_connection": true, "sla_guarantee": "99.9%"}'),
('Student Special', 'Affordable plan for students', 8, 1, 100, 1200.00, 1000.00, '{"wifi_included": true, "support_level": "basic", "static_ip": false, "student_discount": true}'),
('Corporate Unlimited', 'Unlimited high-speed for corporations', 200, 50, NULL, 25000.00, 15000.00, '{"wifi_included": true, "support_level": "enterprise", "static_ip": true, "priority_support": true, "backup_connection": true, "sla_guarantee": "99.95%", "dedicated_support": true}');

-- Insert sample network routers
INSERT INTO network_routers (name, model, ip_address, location, status, last_ping, uptime_seconds, cpu_usage, memory_usage, bandwidth_usage, notes) VALUES
('Core-Router-01', 'Cisco ASR 9000', '10.0.0.1', 'Main Data Center', 'online', CURRENT_TIMESTAMP - INTERVAL '2 minutes', 2592000, 15.5, 45.2, '{"ingress_mbps": 850, "egress_mbps": 920}', 'Primary core router'),
('Edge-Router-Westlands', 'MikroTik CCR1036', '10.0.1.1', 'Westlands Distribution Point', 'online', CURRENT_TIMESTAMP - INTERVAL '1 minute', 1728000, 25.8, 62.1, '{"ingress_mbps": 450, "egress_mbps": 380}', 'Serving Westlands area'),
('Edge-Router-Karen', 'MikroTik CCR1036', '10.0.2.1', 'Karen Distribution Point', 'online', CURRENT_TIMESTAMP - INTERVAL '3 minutes', 1555200, 18.3, 38.7, '{"ingress_mbps": 320, "egress_mbps": 290}', 'Serving Karen and surrounding areas'),
('Access-Router-CBD', 'Ubiquiti EdgeRouter Pro', '10.0.3.1', 'CBD Access Point', 'online', CURRENT_TIMESTAMP - INTERVAL '1 minute', 864000, 32.1, 55.9, '{"ingress_mbps": 180, "egress_mbps": 165}', 'Business district access'),
('Access-Router-Kilimani', 'Ubiquiti EdgeRouter Pro', '10.0.4.1', 'Kilimani Access Point', 'online', CURRENT_TIMESTAMP - INTERVAL '4 minutes', 691200, 28.7, 48.3, '{"ingress_mbps": 220, "egress_mbps": 195}', 'Residential area coverage'),
('Backup-Router-01', 'Cisco ISR 4000', '10.0.5.1', 'Secondary Data Center', 'online', CURRENT_TIMESTAMP - INTERVAL '1 minute', 1296000, 8.2, 22.1, '{"ingress_mbps": 50, "egress_mbps": 45}', 'Backup and redundancy'),
('Edge-Router-Eastlands', 'MikroTik CCR1036', '10.0.6.1', 'Eastlands Distribution Point', 'maintenance', CURRENT_TIMESTAMP - INTERVAL '2 hours', 432000, 0.0, 0.0, '{"ingress_mbps": 0, "egress_mbps": 0}', 'Scheduled maintenance'),
('Access-Router-Industrial', 'Ubiquiti EdgeRouter Pro', '10.0.7.1', 'Industrial Area', 'online', CURRENT_TIMESTAMP - INTERVAL '5 minutes', 518400, 35.4, 67.8, '{"ingress_mbps": 280, "egress_mbps": 310}', 'Industrial and warehouse coverage');

-- Insert sample equipment inventory
INSERT INTO equipment_inventory (name, model, brand, serial_number, mac_address, equipment_type, status, purchase_date, purchase_price, warranty_expiry, location, notes) VALUES
('WiFi Router AC1200', 'Archer C6', 'TP-Link', 'TPL2023001', '00:1B:44:11:3A:B7', 'router', 'available', '2023-01-15', 4500.00, '2025-01-15', 'Warehouse A', 'Dual-band AC1200 router'),
('WiFi Router AC1900', 'Archer C9', 'TP-Link', 'TPL2023002', '00:1B:44:11:3A:B8', 'router', 'available', '2023-01-15', 7500.00, '2025-01-15', 'Warehouse A', 'High-performance AC1900 router'),
('Fiber ONT', 'HG8245H', 'Huawei', 'HW2023001', '00:25:9E:FD:8E:01', 'ont', 'available', '2023-02-10', 3200.00, '2025-02-10', 'Warehouse B', 'GPON ONT with WiFi'),
('Fiber ONT', 'HG8245H', 'Huawei', 'HW2023002', '00:25:9E:FD:8E:02', 'ont', 'available', '2023-02-10', 3200.00, '2025-02-10', 'Warehouse B', 'GPON ONT with WiFi'),
('Cable Modem', 'SB6190', 'Arris', 'AR2023001', '00:90:4C:11:22:33', 'modem', 'available', '2023-03-05', 5500.00, '2025-03-05', 'Warehouse A', 'DOCSIS 3.0 cable modem'),
('Mesh Router', 'Deco M4', 'TP-Link', 'TPL2023003', '00:1B:44:11:3A:B9', 'router', 'available', '2023-03-20', 8500.00, '2025-03-20', 'Warehouse A', '3-pack mesh system'),
('Enterprise Router', 'RB4011iGS+', 'MikroTik', 'MT2023001', '4C:5E:0C:12:34:56', 'router', 'available', '2023-04-12', 15000.00, '2025-04-12', 'Warehouse C', 'Enterprise-grade router'),
('Fiber ONT', 'MA5671A', 'Huawei', 'HW2023003', '00:25:9E:FD:8E:03', 'ont', 'available', '2023-04-25', 2800.00, '2025-04-25', 'Warehouse B', 'Compact GPON ONT'),
('WiFi Extender', 'RE450', 'TP-Link', 'TPL2023004', '00:1B:44:11:3A:BA', 'extender', 'available', '2023-05-08', 3500.00, '2025-05-08', 'Warehouse A', 'AC1750 WiFi extender'),
('Business Router', 'RB2011UiAS-2HnD', 'MikroTik', 'MT2023002', '4C:5E:0C:12:34:57', 'router', 'available', '2023-05-15', 12000.00, '2025-05-15', 'Warehouse C', 'Business router with WiFi');

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, phone, address, customer_type, status, balance, credit_limit, notes) VALUES
('John', 'Kamau', 'john.kamau@email.com', '+254701234567', 'Westlands, Nairobi', 'individual', 'active', 0.00, 5000.00, 'Long-term customer, always pays on time'),
('Mary', 'Wanjiku', 'mary.wanjiku@email.com', '+254702345678', 'Karen, Nairobi', 'individual', 'active', -1500.00, 3000.00, 'Occasional late payments'),
('TechStart Solutions', 'Admin', 'admin@techstart.co.ke', '+254703456789', 'Kilimani, Nairobi', 'business', 'active', 2500.00, 15000.00, 'Growing tech startup, multiple connections'),
('Grace', 'Akinyi', 'grace.akinyi@email.com', '+254704567890', 'South B, Nairobi', 'individual', 'active', 500.00, 2000.00, 'Student discount applied'),
('Mama Mboga Enterprises', 'Owner', 'info@mamamboga.co.ke', '+254705678901', 'Eastlands, Nairobi', 'business', 'suspended', -3500.00, 5000.00, 'Payment issues, needs follow-up'),
('David', 'Mwangi', 'david.mwangi@email.com', '+254706789012', 'Industrial Area, Nairobi', 'individual', 'active', 1200.00, 4000.00, 'Works in industrial area, reliable customer'),
('Corporate Solutions Ltd', 'IT Manager', 'it@corpsolutions.co.ke', '+254707890123', 'Upper Hill, Nairobi', 'corporate', 'active', 5000.00, 50000.00, 'Large corporate client, premium support'),
('Sarah', 'Njeri', 'sarah.njeri@email.com', '+254708901234', 'Lavington, Nairobi', 'individual', 'active', -800.00, 3000.00, 'New customer, setting up payment plan');

-- Get customer IDs for service assignments
DO $$
DECLARE
    customer_john UUID;
    customer_mary UUID;
    customer_techstart UUID;
    customer_grace UUID;
    customer_mama UUID;
    customer_david UUID;
    customer_corporate UUID;
    customer_sarah UUID;
    
    plan_basic UUID;
    plan_standard UUID;
    plan_premium UUID;
    plan_business_starter UUID;
    plan_business_pro UUID;
    plan_enterprise UUID;
    plan_student UUID;
    plan_corporate UUID;
    
    router_westlands UUID;
    router_karen UUID;
    router_cbd UUID;
    router_kilimani UUID;
    router_eastlands UUID;
    router_industrial UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO customer_john FROM customers WHERE email = 'john.kamau@email.com';
    SELECT id INTO customer_mary FROM customers WHERE email = 'mary.wanjiku@email.com';
    SELECT id INTO customer_techstart FROM customers WHERE email = 'admin@techstart.co.ke';
    SELECT id INTO customer_grace FROM customers WHERE email = 'grace.akinyi@email.com';
    SELECT id INTO customer_mama FROM customers WHERE email = 'info@mamamboga.co.ke';
    SELECT id INTO customer_david FROM customers WHERE email = 'david.mwangi@email.com';
    SELECT id INTO customer_corporate FROM customers WHERE email = 'it@corpsolutions.co.ke';
    SELECT id INTO customer_sarah FROM customers WHERE email = 'sarah.njeri@email.com';
    
    -- Get service plan IDs
    SELECT id INTO plan_basic FROM service_plans WHERE name = 'Basic Home';
    SELECT id INTO plan_standard FROM service_plans WHERE name = 'Standard Home';
    SELECT id INTO plan_premium FROM service_plans WHERE name = 'Premium Home';
    SELECT id INTO plan_business_starter FROM service_plans WHERE name = 'Business Starter';
    SELECT id INTO plan_business_pro FROM service_plans WHERE name = 'Business Pro';
    SELECT id INTO plan_enterprise FROM service_plans WHERE name = 'Enterprise';
    SELECT id INTO plan_student FROM service_plans WHERE name = 'Student Special';
    SELECT id INTO plan_corporate FROM service_plans WHERE name = 'Corporate Unlimited';
    
    -- Get router IDs
    SELECT id INTO router_westlands FROM network_routers WHERE name = 'Edge-Router-Westlands';
    SELECT id INTO router_karen FROM network_routers WHERE name = 'Edge-Router-Karen';
    SELECT id INTO router_cbd FROM network_routers WHERE name = 'Access-Router-CBD';
    SELECT id INTO router_kilimani FROM network_routers WHERE name = 'Access-Router-Kilimani';
    SELECT id INTO router_eastlands FROM network_routers WHERE name = 'Edge-Router-Eastlands';
    SELECT id INTO router_industrial FROM network_routers WHERE name = 'Access-Router-Industrial';
    
    -- Insert customer services
    INSERT INTO customer_services (customer_id, service_plan_id, status, installation_date, activation_date, monthly_price, billing_cycle_start, last_billed_date, next_billing_date, router_id, installation_notes) VALUES
    (customer_john, plan_standard, 'active', '2023-06-15', '2023-06-16', 2500.00, 16, '2024-01-16', '2024-02-16', router_westlands, 'Standard installation, customer very satisfied'),
    (customer_mary, plan_premium, 'active', '2023-07-20', '2023-07-21', 4000.00, 21, '2024-01-21', '2024-02-21', router_karen, 'Premium installation with static IP'),
    (customer_techstart, plan_business_pro, 'active', '2023-08-10', '2023-08-11', 7500.00, 11, '2024-01-11', '2024-02-11', router_kilimani, 'Business installation with backup connection'),
    (customer_grace, plan_student, 'active', '2023-09-05', '2023-09-06', 1200.00, 6, '2024-01-06', '2024-02-06', router_kilimani, 'Student discount applied, data cap enforced'),
    (customer_mama, plan_business_starter, 'suspended', '2023-10-12', '2023-10-13', 3500.00, 13, '2023-12-13', '2024-01-13', router_eastlands, 'Suspended due to non-payment'),
    (customer_david, plan_basic, 'active', '2023-11-08', '2023-11-09', 1500.00, 9, '2024-01-09', '2024-02-09', router_industrial, 'Basic plan, reliable customer'),
    (customer_corporate, plan_corporate, 'active', '2023-12-01', '2023-12-02', 25000.00, 2, '2024-01-02', '2024-02-02', router_cbd, 'Corporate unlimited plan with SLA'),
    (customer_sarah, plan_standard, 'active', '2024-01-15', '2024-01-16', 2500.00, 16, '2024-01-16', '2024-02-16', router_karen, 'New customer, payment plan arranged');
END $$;

-- Insert sample IP subnets
INSERT INTO ip_subnets (subnet, description, vlan_id, gateway, dns_servers) VALUES
('192.168.1.0/24', 'Residential customers - Westlands', 100, '192.168.1.1', ARRAY['8.8.8.8', '8.8.4.4']::INET[]),
('192.168.2.0/24', 'Residential customers - Karen', 101, '192.168.2.1', ARRAY['8.8.8.8', '8.8.4.4']::INET[]),
('192.168.10.0/24', 'Business customers - CBD', 200, '192.168.10.1', ARRAY['1.1.1.1', '1.0.0.1']::INET[]),
('192.168.11.0/24', 'Business customers - Kilimani', 201, '192.168.11.1', ARRAY['1.1.1.1', '1.0.0.1']::INET[]),
('10.10.0.0/24', 'Corporate customers', 300, '10.10.0.1', ARRAY['8.8.8.8', '1.1.1.1']::INET[]);

-- Insert sample IP addresses
DO $$
DECLARE
    subnet_residential_west UUID;
    subnet_residential_karen UUID;
    subnet_business_cbd UUID;
    subnet_business_kilimani UUID;
    subnet_corporate UUID;
    i INTEGER;
BEGIN
    -- Get subnet IDs
    SELECT id INTO subnet_residential_west FROM ip_subnets WHERE subnet = '192.168.1.0/24';
    SELECT id INTO subnet_residential_karen FROM ip_subnets WHERE subnet = '192.168.2.0/24';
    SELECT id INTO subnet_business_cbd FROM ip_subnets WHERE subnet = '192.168.10.0/24';
    SELECT id INTO subnet_business_kilimani FROM ip_subnets WHERE subnet = '192.168.11.0/24';
    SELECT id INTO subnet_corporate FROM ip_subnets WHERE subnet = '10.10.0.0/24';
    
    -- Generate IP addresses for each subnet
    FOR i IN 2..254 LOOP
        INSERT INTO ip_addresses (ip_address, subnet_id, status) VALUES
        (('192.168.1.' || i)::INET, subnet_residential_west, 'available'),
        (('192.168.2.' || i)::INET, subnet_residential_karen, 'available'),
        (('192.168.10.' || i)::INET, subnet_business_cbd, 'available'),
        (('192.168.11.' || i)::INET, subnet_business_kilimani, 'available');
    END LOOP;
    
    -- Generate corporate IPs (smaller range)
    FOR i IN 2..100 LOOP
        INSERT INTO ip_addresses (ip_address, subnet_id, status) VALUES
        (('10.10.0.' || i)::INET, subnet_corporate, 'available');
    END LOOP;
END $$;

-- Insert sample payments
DO $$
DECLARE
    customer_john UUID;
    customer_mary UUID;
    customer_techstart UUID;
    customer_grace UUID;
    customer_david UUID;
    customer_corporate UUID;
    customer_sarah UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO customer_john FROM customers WHERE email = 'john.kamau@email.com';
    SELECT id INTO customer_mary FROM customers WHERE email = 'mary.wanjiku@email.com';
    SELECT id INTO customer_techstart FROM customers WHERE email = 'admin@techstart.co.ke';
    SELECT id INTO customer_grace FROM customers WHERE email = 'grace.akinyi@email.com';
    SELECT id INTO customer_david FROM customers WHERE email = 'david.mwangi@email.com';
    SELECT id INTO customer_corporate FROM customers WHERE email = 'it@corpsolutions.co.ke';
    SELECT id INTO customer_sarah FROM customers WHERE email = 'sarah.njeri@email.com';
    
    -- Insert payment history
    INSERT INTO payments (customer_id, amount, payment_method, payment_reference, transaction_id, status, payment_date, description) VALUES
    (customer_john, 2500.00, 'mpesa', 'QA12B3C4D5', 'MP240115001', 'completed', '2024-01-15 14:30:00', 'Monthly service payment - January 2024'),
    (customer_john, 2500.00, 'mpesa', 'QA12B3C4D6', 'MP231215001', 'completed', '2023-12-15 16:45:00', 'Monthly service payment - December 2023'),
    (customer_mary, 4000.00, 'airtel_money', 'AM240120001', 'AM240120001', 'completed', '2024-01-20 10:15:00', 'Monthly service payment - January 2024'),
    (customer_techstart, 7500.00, 'bank_transfer', 'BT240110001', 'KCB240110001', 'completed', '2024-01-10 09:00:00', 'Monthly service payment - January 2024'),
    (customer_grace, 1200.00, 'mpesa', 'QA12B3C4D7', 'MP240105001', 'completed', '2024-01-05 12:20:00', 'Monthly service payment - January 2024'),
    (customer_david, 1500.00, 'mpesa', 'QA12B3C4D8', 'MP240108001', 'completed', '2024-01-08 15:10:00', 'Monthly service payment - January 2024'),
    (customer_  'completed', '2024-01-08 15:10:00', 'Monthly service payment - January 2024'),
    (customer_corporate, 25000.00, 'bank_transfer', 'BT240101001', 'EQUITY240101001', 'completed', '2024-01-01 08:30:00', 'Monthly service payment - January 2024'),
    (customer_sarah, 2500.00, 'mpesa', 'QA12B3C4D9', 'MP240116001', 'completed', '2024-01-16 11:45:00', 'Monthly service payment - January 2024'),
    -- Previous month payments
    (customer_john, 2500.00, 'mpesa', 'QA12B3C4D0', 'MP231115001', 'completed', '2023-11-15 14:30:00', 'Monthly service payment - November 2023'),
    (customer_mary, 4000.00, 'airtel_money', 'AM231120001', 'AM231120001', 'completed', '2023-11-20 10:15:00', 'Monthly service payment - November 2023'),
    (customer_techstart, 7500.00, 'bank_transfer', 'BT231110001', 'KCB231110001', 'completed', '2023-11-10 09:00:00', 'Monthly service payment - November 2023');
END $$;

-- Insert sample invoices
DO $$
DECLARE
    customer_john UUID;
    customer_mary UUID;
    customer_techstart UUID;
    customer_grace UUID;
    customer_mama UUID;
    customer_david UUID;
    customer_corporate UUID;
    customer_sarah UUID;
    
    service_john UUID;
    service_mary UUID;
    service_techstart UUID;
    service_grace UUID;
    service_mama UUID;
    service_david UUID;
    service_corporate UUID;
    service_sarah UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO customer_john FROM customers WHERE email = 'john.kamau@email.com';
    SELECT id INTO customer_mary FROM customers WHERE email = 'mary.wanjiku@email.com';
    SELECT id INTO customer_techstart FROM customers WHERE email = 'admin@techstart.co.ke';
    SELECT id INTO customer_grace FROM customers WHERE email = 'grace.akinyi@email.com';
    SELECT id INTO customer_mama FROM customers WHERE email = 'info@mamamboga.co.ke';
    SELECT id INTO customer_david FROM customers WHERE email = 'david.mwangi@email.com';
    SELECT id INTO customer_corporate FROM customers WHERE email = 'it@corpsolutions.co.ke';
    SELECT id INTO customer_sarah FROM customers WHERE email = 'sarah.njeri@email.com';
    
    -- Get service IDs
    SELECT cs.id INTO service_john FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'john.kamau@email.com';
    SELECT cs.id INTO service_mary FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'mary.wanjiku@email.com';
    SELECT cs.id INTO service_techstart FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'admin@techstart.co.ke';
    SELECT cs.id INTO service_grace FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'grace.akinyi@email.com';
    SELECT cs.id INTO service_mama FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'info@mamamboga.co.ke';
    SELECT cs.id INTO service_david FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'david.mwangi@email.com';
    SELECT cs.id INTO service_corporate FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'it@corpsolutions.co.ke';
    SELECT cs.id INTO service_sarah FROM customer_services cs JOIN customers c ON cs.customer_id = c.id WHERE c.email = 'sarah.njeri@email.com';
    
    -- Insert invoices
    INSERT INTO invoices (customer_id, service_id, amount, total_amount, due_date, paid_date, status, description) VALUES
    -- Paid invoices
    (customer_john, service_john, 2500.00, 2500.00, '2024-01-16', '2024-01-15', 'completed', 'Monthly service fee - January 2024'),
    (customer_mary, service_mary, 4000.00, 4000.00, '2024-01-21', '2024-01-20', 'completed', 'Monthly service fee - January 2024'),
    (customer_techstart, service_techstart, 7500.00, 7500.00, '2024-01-11', '2024-01-10', 'completed', 'Monthly service fee - January 2024'),
    (customer_grace, service_grace, 1200.00, 1200.00, '2024-01-06', '2024-01-05', 'completed', 'Monthly service fee - January 2024'),
    (customer_david, service_david, 1500.00, 1500.00, '2024-01-09', '2024-01-08', 'completed', 'Monthly service fee - January 2024'),
    (customer_corporate, service_corporate, 25000.00, 25000.00, '2024-01-02', '2024-01-01', 'completed', 'Monthly service fee - January 2024'),
    (customer_sarah, service_sarah, 2500.00, 2500.00, '2024-01-16', '2024-01-16', 'completed', 'Monthly service fee - January 2024'),
    
    -- Pending invoices (February 2024)
    (customer_john, service_john, 2500.00, 2500.00, '2024-02-16', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_mary, service_mary, 4000.00, 4000.00, '2024-02-21', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_techstart, service_techstart, 7500.00, 7500.00, '2024-02-11', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_grace, service_grace, 1200.00, 1200.00, '2024-02-06', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_david, service_david, 1500.00, 1500.00, '2024-02-09', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_corporate, service_corporate, 25000.00, 25000.00, '2024-02-02', NULL, 'pending', 'Monthly service fee - February 2024'),
    (customer_sarah, service_sarah, 2500.00, 2500.00, '2024-02-16', NULL, 'pending', 'Monthly service fee - February 2024'),
    
    -- Overdue invoices (for mama mboga - suspended customer)
    (customer_mama, service_mama, 3500.00, 3500.00, '2024-01-13', NULL, 'overdue', 'Monthly service fee - January 2024'),
    (customer_mama, service_mama, 3500.00, 3500.00, '2023-12-13', NULL, 'overdue', 'Monthly service fee - December 2023');
END $$;

-- Insert sample support tickets
DO $$
DECLARE
    customer_john UUID;
    customer_mary UUID;
    customer_techstart UUID;
    customer_grace UUID;
    customer_mama UUID;
BEGIN
    -- Get customer IDs
    SELECT id INTO customer_john FROM customers WHERE email = 'john.kamau@email.com';
    SELECT id INTO customer_mary FROM customers WHERE email = 'mary.wanjiku@email.com';
    SELECT id INTO customer_techstart FROM customers WHERE email = 'admin@techstart.co.ke';
    SELECT id INTO customer_grace FROM customers WHERE email = 'grace.akinyi@email.com';
    SELECT id INTO customer_mama FROM customers WHERE email = 'info@mamamboga.co.ke';
    
    -- Insert support tickets
    INSERT INTO support_tickets (customer_id, title, description, priority, status, assigned_to, resolution, created_at, resolved_at) VALUES
    (customer_john, 'Slow internet speed', 'Internet speed is slower than usual, especially during evening hours', 'medium', 'resolved', 'tech_support_1', 'Router firmware updated and QoS configured. Speed restored to normal.', '2024-01-10 09:15:00', '2024-01-10 14:30:00'),
    (customer_mary, 'WiFi connection drops frequently', 'WiFi keeps disconnecting every few minutes, very frustrating', 'high', 'resolved', 'tech_support_2', 'Replaced faulty router with new unit. Connection stable now.', '2024-01-12 16:20:00', '2024-01-13 10:45:00'),
    (customer_techstart, 'Need static IP configuration', 'Require static IP setup for our business servers and email', 'medium', 'resolved', 'network_admin', 'Static IP 192.168.10.50 configured and tested. All services working.', '2024-01-08 11:30:00', '2024-01-08 15:20:00'),
    (customer_grace, 'Data usage monitoring', 'Need help understanding my data usage as a student plan subscriber', 'low', 'resolved', 'customer_service', 'Explained data monitoring tools and usage patterns. Customer satisfied.', '2024-01-15 14:10:00', '2024-01-15 14:45:00'),
    (customer_mama, 'Service suspension inquiry', 'Why was my service suspended? Need clarification on payment status', 'high', 'in_progress', 'billing_team', NULL, '2024-01-18 08:30:00', NULL),
    (customer_john, 'Request for speed upgrade', 'Interested in upgrading to premium plan, need pricing information', 'low', 'open', 'sales_team', NULL, '2024-01-20 13:45:00', NULL);
END $$;

-- Update customer balances based on payments and invoices
UPDATE customers SET balance = calculate_customer_balance(id);

-- Refresh materialized views
SELECT refresh_materialized_views();

-- Log the sample data insertion
SELECT log_activity('sample_data', 'INSERT', 'bulk_insert', 
    jsonb_build_object(
        'customers', (SELECT COUNT(*) FROM customers),
        'service_plans', (SELECT COUNT(*) FROM service_plans),
        'customer_services', (SELECT COUNT(*) FROM customer_services),
        'payments', (SELECT COUNT(*) FROM payments),
        'invoices', (SELECT COUNT(*) FROM invoices),
        'support_tickets', (SELECT COUNT(*) FROM support_tickets),
        'network_routers', (SELECT COUNT(*) FROM network_routers),
        'equipment_inventory', (SELECT COUNT(*) FROM equipment_inventory),
        'ip_addresses', (SELECT COUNT(*) FROM ip_addresses)
    )
);
