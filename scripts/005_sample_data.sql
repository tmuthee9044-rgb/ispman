-- Sample Data for ISP Management System

-- Insert sample service plans
INSERT INTO service_plans (name, description, plan_code, speed_down, speed_up, monthly_fee, setup_fee, plan_type, features) VALUES
('Starter Plan', 'Perfect for light internet usage, email, and basic browsing', 'STARTER', 10, 5, 2999.00, 1500.00, 'residential', 
 '["Email & Web Browsing", "Basic Streaming", "24/7 Support", "Fair Usage Policy"]'),

('Home Basic', 'Great for streaming, video calls, and moderate usage', 'HOME_BASIC', 25, 12, 3999.00, 1500.00, 'residential', 
 '["HD Streaming", "Video Calls", "Multiple Devices", "24/7 Support", "Social Media"]'),

('Home Standard', 'High-speed internet for families and heavy usage', 'HOME_STD', 50, 25, 4999.00, 2000.00, 'residential', 
 '["4K Streaming", "Gaming", "Smart Home", "Priority Support", "Unlimited Usage"]'),

('Home Premium', 'Ultra-fast internet for power users and content creators', 'HOME_PREM', 100, 50, 7999.00, 2500.00, 'residential', 
 '["Ultra-fast Speed", "Content Creation", "Gaming Pro", "Priority Support", "Static IP Option"]'),

('Business Starter', 'Reliable internet solution for small businesses', 'BIZ_START', 75, 37, 8999.00, 3000.00, 'business', 
 '["Business Grade", "Static IP", "SLA Guarantee", "Priority Support", "Email Hosting"]'),

('Business Standard', 'Comprehensive internet for growing businesses', 'BIZ_STD', 150, 75, 12999.00, 4000.00, 'business', 
 '["Enterprise Grade", "Multiple Static IPs", "99.9% Uptime SLA", "Dedicated Support", "VPN Access"]'),

('Business Premium', 'Enterprise-grade internet for large businesses', 'BIZ_PREM', 250, 125, 19999.00, 5000.00, 'business', 
 '["Enterprise Grade", "Dedicated Support", "99.9% Uptime SLA", "Multiple Static IPs", "24/7 NOC"]'),

('Corporate Enterprise', 'Maximum performance for large corporations', 'CORP_ENT', 500, 250, 35999.00, 10000.00, 'corporate', 
 '["Dedicated Bandwidth", "Redundant Connections", "99.99% SLA", "24/7 Dedicated Support", "Custom Solutions"]');

-- Insert sample network routers
INSERT INTO network_routers (name, router_type, brand, model, ip_address, location, status, cpu_load, memory_usage) VALUES
('Core-Router-01', 'core', 'Cisco', 'ASR 9000', '10.0.0.1', 'Main Data Center - Nairobi CBD', 'online', 45, 62),
('Core-Router-02', 'core', 'Cisco', 'ASR 9000', '10.0.0.2', 'Backup Data Center - Westlands', 'online', 38, 55),
('Edge-Router-01', 'edge', 'Mikrotik', 'CCR1036', '192.168.1.1', 'Tower A - Nairobi CBD', 'online', 52, 68),
('Edge-Router-02', 'edge', 'Mikrotik', 'CCR1036', '192.168.1.2', 'Tower B - Westlands', 'online', 47, 71),
('Edge-Router-03', 'edge', 'Mikrotik', 'CCR1036', '192.168.1.3', 'Tower C - Karen', 'online', 41, 59),
('Edge-Router-04', 'edge', 'Mikrotik', 'CCR1036', '192.168.1.4', 'Tower D - Kiambu', 'maintenance', 0, 0),
('Access-Router-01', 'access', 'Ubiquiti', 'EdgeRouter Pro', '192.168.10.1', 'Residential Area - Kilimani', 'online', 35, 48),
('Access-Router-02', 'access', 'Ubiquiti', 'EdgeRouter Pro', '192.168.10.2', 'Business District - Upper Hill', 'online', 42, 53);

-- Insert sample customer equipment
INSERT INTO customer_routers (equipment_type, brand, model, serial_number, mac_address, wifi_bands, max_speed, ethernet_ports, status, purchase_price) VALUES
('router', 'TP-Link', 'Archer C6', 'TL2024001234', '00:1A:2B:3C:4D:5E', '2.4GHz + 5GHz', '1200Mbps', 4, 'available', 8500.00),
('router', 'TP-Link', 'Archer C6', 'TL2024001235', '00:1A:2B:3C:4D:5F', '2.4GHz + 5GHz', '1200Mbps', 4, 'available', 8500.00),
('ont', 'Huawei', 'HG8245H', 'HW2024005678', '00:2A:3B:4C:5D:6E', '2.4GHz + 5GHz', '1000Mbps', 4, 'available', 12000.00),
('ont', 'Huawei', 'HG8245H', 'HW2024005679', '00:2A:3B:4C:5D:6F', '2.4GHz + 5GHz', '1000Mbps', 4, 'available', 12000.00),
('ont', 'ZTE', 'ZXHN F670L', 'ZT2024009012', '00:3A:4B:5C:6D:7E', '2.4GHz + 5GHz', '1200Mbps', 4, 'available', 11500.00),
('ont', 'ZTE', 'ZXHN F670L', 'ZT2024009013', '00:3A:4B:5C:6D:7F', '2.4GHz + 5GHz', '1200Mbps', 4, 'available', 11500.00),
('router', 'Mikrotik', 'hAP ac2', 'MT2024003456', '00:4A:5B:6C:7D:8E', '2.4GHz + 5GHz', '1200Mbps', 5, 'available', 15000.00),
('router', 'Mikrotik', 'hAP ac2', 'MT2024003457', '00:4A:5  '1200Mbps', 5, 'available', 15000.00),
('router', 'Mikrotik', 'hAP ac2', 'MT2024003457', '00:4A:5B:6C:7D:8F', '2.4GHz + 5GHz', '1200Mbps', 5, 'available', 15000.00),
('ont', 'Fiberhome', 'HG6245D', 'FH2024007890', '00:5A:6B:7C:8D:9E', '2.4GHz + 5GHz', '1000Mbps', 4, 'available', 10500.00),
('ont', 'Fiberhome', 'HG6245D', 'FH2024007891', '00:5A:6B:7C:8D:9F', '2.4GHz + 5GHz', '1000Mbps', 4, 'available', 10500.00);

-- Insert sample customers
INSERT INTO customers (
    customer_type, first_name, last_name, company_name, email, phone, alternate_phone,
    physical_address, city, county, portal_login_id, portal_username, 
    account_balance, preferred_payment_method, mpesa_number, status
) VALUES
('individual', 'John', 'Kamau', NULL, 'john.kamau@email.com', '+254712345678', '+254722345678',
 '123 Kenyatta Avenue, Nairobi', 'Nairobi', 'Nairobi', 'john001', 'john_kamau', 
 0.00, 'mpesa', '254712345678', 'active'),

('individual', 'Mary', 'Wanjiku', NULL, 'mary.wanjiku@email.com', '+254723456789', NULL,
 '456 Uhuru Highway, Nairobi', 'Nairobi', 'Nairobi', 'mary002', 'mary_wanjiku', 
 1500.00, 'mpesa', '254723456789', 'active'),

('business', 'Peter', 'Mwangi', 'TechSolutions Ltd', 'peter@techsolutions.co.ke', '+254734567890', '+254744567890',
 '789 Moi Avenue, Nairobi', 'Nairobi', 'Nairobi', 'tech003', 'techsolutions', 
 -5000.00, 'bank_transfer', NULL, 'active'),

('individual', 'Grace', 'Akinyi', NULL, 'grace.akinyi@email.com', '+254745678901', NULL,
 '321 Tom Mboya Street, Nairobi', 'Nairobi', 'Nairobi', 'grace004', 'grace_akinyi', 
 2500.00, 'airtel', '254745678901', 'active'),

('business', 'Samuel', 'Ochieng', 'Digital Innovations Kenya', 'samuel@digikenya.com', '+254756789012', '+254766789012',
 '654 Kimathi Street, Nairobi', 'Nairobi', 'Nairobi', 'digi005', 'digikenya', 
 0.00, 'mpesa', '254756789012', 'active'),

('individual', 'Faith', 'Njeri', NULL, 'faith.njeri@gmail.com', '+254767890123', NULL,
 '987 Ngong Road, Nairobi', 'Nairobi', 'Nairobi', 'faith006', 'faith_njeri', 
 -2999.00, 'mpesa', '254767890123', 'suspended'),

('corporate', 'David', 'Kiprotich', 'Enterprise Solutions Corp', 'david@enterprisesolutions.co.ke', '+254778901234', '+254788901234',
 '147 Westlands Road, Nairobi', 'Nairobi', 'Nairobi', 'ent007', 'enterprisesolutions', 
 10000.00, 'bank_transfer', NULL, 'active'),

('individual', 'Rose', 'Wambui', NULL, 'rose.wambui@yahoo.com', '+254789012345', NULL,
 '258 Langata Road, Nairobi', 'Nairobi', 'Nairobi', 'rose008', 'rose_wambui', 
 500.00, 'airtel', '254789012345', 'active');

-- Insert customer services
INSERT INTO customer_services (
    customer_id, service_plan_id, service_id, connection_type, status, monthly_fee, 
    next_billing_date, network_router_id, customer_router_id, activation_date
) VALUES
(1, 1, 'SVC001', 'fiber', 'active', 2999.00, '2024-02-15', 3, 1, '2024-01-15'),
(2, 3, 'SVC002', 'wireless', 'active', 4999.00, '2024-02-20', 4, 3, '2024-01-20'),
(3, 6, 'SVC003', 'fiber', 'active', 12999.00, '2024-02-10', 3, 5, '2024-01-10'),
(4, 2, 'SVC004', 'wireless', 'suspended', 3999.00, '2024-02-25', 5, 7, '2024-01-25'),
(5, 4, 'SVC005', 'fiber', 'active', 7999.00, '2024-02-12', 4, 9, '2024-01-12'),
(6, 1, 'SVC006', 'wireless', 'suspended', 2999.00, '2024-02-28', 6, NULL, '2024-01-28'),
(7, 8, 'SVC007', 'fiber', 'active', 35999.00, '2024-02-05', 1, NULL, '2024-01-05'),
(8, 2, 'SVC008', 'wireless', 'active', 3999.00, '2024-02-18', 7, NULL, '2024-01-18');

-- Update customer router allocations
UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 1, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '123 Kenyatta Avenue, Nairobi'
WHERE id = 1;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 2, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '456 Uhuru Highway, Nairobi'
WHERE id = 3;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 3, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '789 Moi Avenue, Nairobi'
WHERE id = 5;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 4, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '321 Tom Mboya Street, Nairobi'
WHERE id = 7;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 5, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '654 Kimathi Street, Nairobi'
WHERE id = 9;

-- Insert sample payments
INSERT INTO payments (
    customer_id, amount, currency, payment_method, transaction_id, 
    mpesa_receipt_number, mpesa_phone_number, status, payment_date, allocated_amount
) VALUES
(1, 2999.00, 'KES', 'M-Pesa', 'QA12345678', 'QA12345678', '254712345678', 'completed', '2024-01-15 10:30:00', 2999.00),
(2, 4999.00, 'KES', 'M-Pesa', 'QA23456789', 'QA23456789', '254723456789', 'completed', '2024-01-20 14:15:00', 4999.00),
(3, 12999.00, 'KES', 'Bank Transfer', 'BT34567890', NULL, NULL, 'completed', '2024-01-10 09:00:00', 12999.00),
(4, 2000.00, 'KES', 'Airtel Money', 'AT45678901', NULL, NULL, 'completed', '2024-01-25 16:45:00', 2000.00),
(5, 7999.00, 'KES', 'M-Pesa', 'QA34567890', 'QA34567890', '254756789012', 'completed', '2024-01-12 11:20:00', 7999.00),
(7, 35999.00, 'KES', 'Bank Transfer', 'BT45678901', NULL, NULL, 'completed', '2024-01-05 08:30:00', 35999.00),
(8, 3999.00, 'KES', 'Airtel Money', 'AT56789012', NULL, NULL, 'completed', '2024-01-18 13:45:00', 3999.00),
(1, 2999.00, 'KES', 'M-Pesa', 'QA45678901', 'QA45678901', '254712345678', 'completed', '2024-02-15 09:15:00', 2999.00),
(2, 4999.00, 'KES', 'M-Pesa', 'QA56789012', 'QA56789012', '254723456789', 'pending', '2024-02-20 10:00:00', 0.00);

-- Insert sample invoices
INSERT INTO invoices (
    customer_id, subtotal, tax_amount, total_amount, paid_amount, balance_due, 
    invoice_date, due_date, status, line_items, billing_period_start, billing_period_end
) VALUES
(1, 2999.00, 479.84, 3478.84, 3478.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Starter Plan - Monthly Service", "quantity": 1, "unit_price": 2999.00, "total": 2999.00}]',
 '2024-01-01', '2024-01-31'),

(2, 4999.00, 799.84, 5798.84, 5798.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Home Standard - Monthly Service", "quantity": 1, "unit_price": 4999.00, "total": 4999.00}]',
 '2024-01-01', '2024-01-31'),

(3, 12999.00, 2079.84, 15078.84, 15078.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Business Standard - Monthly Service", "quantity": 1, "unit_price": 12999.00, "total": 12999.00}]',
 '2024-01-01', '2024-01-31'),

(4, 3999.00, 639.84, 4638.84, 2000.00, 2638.84, '2024-01-01', '2024-01-31', 'overdue',
 '[{"description": "Home Basic - Monthly Service", "quantity": 1, "unit_price": 3999.00, "total": 3999.00}]',
 '2024-01-01', '2024-01-31'),

(5, 7999.00, 1279.84, 9278.84, 9278.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Home Premium - Monthly Service", "quantity": 1, "unit_price": 7999.00, "total": 7999.00}]',
 '2024-01-01', '2024-01-31'),

(7, 35999.00, 5759.84, 41758.84, 41758.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Corporate Enterprise - Monthly Service", "quantity": 1, "unit_price": 35999.00, "total": 35999.00}]',
 '2024-01-01', '2024-01-31'),

(8, 3999.00, 639.84, 4638.84, 4638.84, 0.00, '2024-01-01', '2024-01-31', 'paid',
 '[{"description": "Home Basic - Monthly Service", "quantity": 1, "unit_price": 3999.00, "total": 3999.00}]',
 '2024-01-01', '2024-01-31'),

-- February invoices
(1, 2999.00, 479.84, 3478.84, 3478.84, 0.00, '2024-02-01', '2024-02-29', 'paid',
 '[{"description": "Starter Plan - Monthly Service", "quantity": 1, "unit_price": 2999.00, "total": 2999.00}]',
 '2024-02-01', '2024-02-29'),

(2, 4999.00, 799.84, 5798.84, 0.00, 5798.84, '2024-02-01', '2024-02-29', 'pending',
 '[{"description": "Home Standard - Monthly Service", "quantity": 1, "unit_price": 4999.00, "total": 4999.00}]',
 '2024-02-01', '2024-02-29');

-- Insert sample system logs
INSERT INTO system_logs (level, source, category, message, ip_address, customer_id, details) VALUES
('INFO', 'M-Pesa Gateway', 'payment', 'Payment received: KES 2,999', '192.168.1.50', 1, 
 '{"transaction_id": "QA12345678", "amount": 2999.00, "phone": "254712345678"}'),

('INFO', 'Airtel Money Gateway', 'payment', 'Payment received: KES 2,000', '192.168.1.51', 4, 
 '{"transaction_id": "AT45678901", "amount": 2000.00, "phone": "254745678901"}'),

('INFO', 'Customer Portal', 'user', 'Customer logged in', '41.90.64.15', 1, 
 '{"session_id": "sess_abc123", "browser": "Chrome 120.0"}'),

('WARNING', 'Payment Gateway', 'payment', 'Payment timeout for transaction AT11223344', '192.168.1.51', NULL, 
 '{"transaction_id": "AT11223344", "timeout_duration": "5min", "retry_count": 3}'),

('INFO', 'System', 'system', 'Database backup completed successfully', NULL, NULL, 
 '{"backup_size": "2.5GB", "duration": "00:15:30"}'),

('ERROR', 'Network Monitor', 'network', 'Router Edge-Router-04 is offline', '192.168.1.4', NULL, 
 '{"router_id": 6, "last_ping": "2024-01-20T10:30:00Z", "downtime": "2 hours"}'),

('INFO', 'Service Management', 'service', 'Service activated for customer 1', NULL, 1, 
 '{"service_id": "SVC001", "plan": "Starter Plan", "activation_date": "2024-01-15"}'),

('WARNING', 'Billing System', 'billing', 'Invoice overdue for customer 4', NULL, 4, 
 '{"invoice_id": 4, "amount_due": 2638.84, "days_overdue": 25}');

-- Refresh materialized views
SELECT refresh_materialized_views();
