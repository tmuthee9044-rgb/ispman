-- Insert sample customers with KES pricing
INSERT INTO customers (
    customer_type, first_name, last_name, email, phone, physical_address, 
    city, county, portal_login_id, portal_username, account_balance, 
    preferred_payment_method, mpesa_number, status
) VALUES
('individual', 'John', 'Kamau', 'john.kamau@email.com', '+254712345678', 
 '123 Kenyatta Avenue, Nairobi', 'Nairobi', 'Nairobi', 'john001', 'john_kamau', 
 -2999.00, 'mpesa', '254712345678', 'active'),

('individual', 'Mary', 'Wanjiku', 'mary.wanjiku@email.com', '+254723456789', 
 '456 Uhuru Highway, Nairobi', 'Nairobi', 'Nairobi', 'mary002', 'mary_wanjiku', 
 0.00, 'mpesa', '254723456789', 'active'),

('business', 'Peter', 'Mwangi', 'peter@techsolutions.co.ke', '+254734567890', 
 '789 Moi Avenue, Nairobi', 'Nairobi', 'Nairobi', 'tech003', 'techsolutions', 
 -9999.00, 'bank_transfer', NULL, 'active'),

('individual', 'Grace', 'Akinyi', 'grace.akinyi@email.com', '+254745678901', 
 '321 Tom Mboya Street, Nairobi', 'Nairobi', 'Nairobi', 'grace004', 'grace_akinyi', 
 1500.00, 'airtel', '254745678901', 'active');

-- Insert customer services with KES pricing
INSERT INTO customer_services (
    customer_id, service_plan_id, connection_type, status, monthly_fee, 
    next_billing_date, network_router_id, customer_router_id, activation_date
) VALUES
(1, 1, 'fiber', 'active', 2999.00, '2024-02-15', 1, 1, '2024-01-15'),
(2, 2, 'wireless', 'active', 4999.00, '2024-02-20', 2, 2, '2024-01-20'),
(3, 4, 'fiber', 'active', 9999.00, '2024-02-10', 1, 3, '2024-01-10'),
(4, 3, 'wireless', 'suspended', 7999.00, '2024-02-25', 3, 4, '2024-01-25');

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
WHERE id = 2;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 3, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '789 Moi Avenue, Nairobi'
WHERE id = 3;

UPDATE customer_routers SET 
    status = 'allocated', 
    allocated_to_customer = 4, 
    allocation_date = CURRENT_TIMESTAMP,
    current_location = '321 Tom Mboya Street, Nairobi'
WHERE id = 4;

-- Insert sample payments in KES
INSERT INTO payments (
    customer_id, amount, currency, payment_method, transaction_id, 
    mpesa_receipt_number, mpesa_phone_number, status, payment_date, allocated_amount
) VALUES
(1, 2999.00, 'KES', 'M-Pesa', 'QA12345678', 'QA12345678', '254712345678', 'completed', '2024-01-15 10:30:00', 2999.00),
(2, 4999.00, 'KES', 'M-Pesa', 'QA23456789', 'QA23456789', '254723456789', 'completed', '2024-01-20 14:15:00', 4999.00),
(3, 9999.00, 'KES', 'Bank Transfer', 'BT34567890', NULL, NULL, 'completed', '2024-01-10 09:00:00', 9999.00),
(4, 3000.00, 'KES', 'Airtel Money', 'AT45678901', NULL, NULL, 'completed', '2024-01-25 16:45:00', 3000.00);

-- Insert sample invoices in KES
INSERT INTO invoices (
    customer_id, invoice_number, subtotal, tax_amount, total_amount, 
    paid_amount, balance_due, invoice_date, due_date, status
) VALUES
(1, 'INV-2024-001', 2999.00, 479.84, 3478.84, 3478.84, 0.00, '2024-01-01', '2024-01-31', 'paid'),
(2, 'INV-2024-002', 4999.00, 799.84, 5798.84, 5798.84, 0.00, '2024-01-01', '2024-01-31', 'paid'),
(3, 'INV-2024-003', 9999.00, 1599.84, 11598.84, 11598.84, 0.00, '2024-01-01', '2024-01-31', 'paid'),
(4, 'INV-2024-004', 7999.00, 1279.84, 9278.84, 3000.00, 6278.84, '2024-01-01', '2024-01-31', 'overdue');

-- Insert sample system logs
INSERT INTO system_logs (level, source, category, message, ip_address, customer_id, details) VALUES
('SUCCESS', 'M-Pesa Gateway', 'mpesa', 'Payment received: KES 2,999', '192.168.1.50', 1, '{"transaction_id": "QA12345678", "amount": 2999.00, "phone": "254712345678"}'),
('SUCCESS', 'Airtel Money Gateway', 'airtel', 'Payment received: KES 3,000', '192.168.1.51', 4, '{"transaction_id": "AT45678901", "amount": 3000.00, "phone": "254745678901"}'),
('INFO', 'Customer Portal', 'user', 'Customer logged in', '41.90.64.15', 1, '{"session_id": "sess_abc123", "browser": "Chrome 120.0"}'),
('WARNING', 'Payment Gateway', 'airtel', 'Payment timeout for transaction AT11223344', '192.168.1.51', NULL, '{"transaction_id": "AT11223344", "timeout_duration": "5min", "retry_count": 3}'),
('INFO', 'System', 'system', 'Database backup completed successfully', NULL, NULL, '{"backup_size": "2.5GB", "duration": "00:15:30"}');

-- Insert sample vehicles
INSERT INTO vehicles (
    registration, make, model, year, vehicle_type, status, assigned_driver, 
    current_location, mileage, fuel_consumption, last_service_date, 
    next_service_date, insurance_expiry, purchase_price, current_value
) VALUES
('KCA 123A', 'Toyota', 'Hiace', 2020, 'bus', 'active', 'John Kamau', 
 'Nairobi CBD', 45000, 12.5, '2024-01-10', '2024-04-10', '2024-12-31', 
 2800000.00, 2200000.00),

('KBZ 456B', 'Isuzu', 'NPR', 2019, 'truck', 'maintenance', 'Peter Mwangi', 
 'Workshop', 78000, 8.2, '2024-01-05', '2024-04-05', '2024-11-15', 
 3500000.00, 2800000.00),

('KCD 789C', 'Nissan', 'Note', 2021, 'car', 'active', 'Mary Wanjiku', 
 'Westlands', 25000, 15.8, '2024-01-15', '2024-04-15', '2025-01-20', 
 1800000.00, 1600000.00);
