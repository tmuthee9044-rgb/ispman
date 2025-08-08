-- TR-069 Configuration Tables
CREATE TABLE IF NOT EXISTS tr069_configurations (
    id SERIAL PRIMARY KEY,
    acs_server_url VARCHAR(255) NOT NULL,
    acs_username VARCHAR(100),
    acs_password VARCHAR(100),
    connection_request_username VARCHAR(100),
    connection_request_password VARCHAR(100),
    connection_request_port INTEGER DEFAULT 7547,
    periodic_inform_enable BOOLEAN DEFAULT true,
    periodic_inform_interval INTEGER DEFAULT 3600,
    ssl_enabled BOOLEAN DEFAULT false,
    ssl_verify BOOLEAN DEFAULT true,
    certificate_path VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tr069_devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    software_version VARCHAR(100),
    hardware_version VARCHAR(100),
    mac_address VARCHAR(17),
    ip_address INET,
    connection_request_url VARCHAR(255),
    last_inform TIMESTAMP,
    status VARCHAR(50) DEFAULT 'online',
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tr069_parameters (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) REFERENCES tr069_devices(device_id),
    parameter_name VARCHAR(255) NOT NULL,
    parameter_value TEXT,
    parameter_type VARCHAR(50) DEFAULT 'string',
    writable BOOLEAN DEFAULT false,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tr069_tasks (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) REFERENCES tr069_devices(device_id),
    task_type VARCHAR(50) NOT NULL, -- reboot, factory_reset, provision, get_parameters, set_parameters
    parameters JSONB,
    status VARCHAR(50) DEFAULT 'pending',
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP,
    result JSONB,
    error_message TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SmartOLT Configuration Tables
CREATE TABLE IF NOT EXISTS smartolt_configurations (
    id SERIAL PRIMARY KEY,
    api_base_url VARCHAR(255) NOT NULL,
    api_username VARCHAR(100),
    api_password VARCHAR(100),
    api_token VARCHAR(500),
    connection_timeout INTEGER DEFAULT 30,
    max_connections INTEGER DEFAULT 10,
    sync_enabled BOOLEAN DEFAULT true,
    sync_interval INTEGER DEFAULT 300, -- 5 minutes
    auto_provision BOOLEAN DEFAULT false,
    wifi_auto_config BOOLEAN DEFAULT false,
    wifi_ssid_template VARCHAR(100) DEFAULT 'TrustWaves_{serial}',
    wifi_password_template VARCHAR(100) DEFAULT '{serial}_wifi',
    status VARCHAR(50) DEFAULT 'active',
    last_sync TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS smartolt_devices (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- olt, onu
    ip_address INET,
    mac_address VARCHAR(17),
    serial_number VARCHAR(100),
    model VARCHAR(100),
    firmware_version VARCHAR(100),
    status VARCHAR(50) DEFAULT 'online',
    location VARCHAR(255),
    olt_id INTEGER REFERENCES smartolt_devices(id),
    port_number INTEGER,
    vlan_id INTEGER,
    service_profile VARCHAR(100),
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_id INTEGER REFERENCES customers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS smartolt_onus (
    id SERIAL PRIMARY KEY,
    olt_device_id INTEGER REFERENCES smartolt_devices(id),
    onu_id INTEGER NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    mac_address VARCHAR(17),
    model VARCHAR(100),
    firmware_version VARCHAR(100),
    rx_power DECIMAL(5,2),
    tx_power DECIMAL(5,2),
    distance INTEGER,
    status VARCHAR(50) DEFAULT 'online',
    provisioned BOOLEAN DEFAULT false,
    service_profile VARCHAR(100),
    wifi_ssid VARCHAR(100),
    wifi_password VARCHAR(100),
    customer_id INTEGER REFERENCES customers(id),
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS smartolt_performance_history (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES smartolt_devices(id),
    rx_power DECIMAL(5,2),
    tx_power DECIMAL(5,2),
    temperature DECIMAL(5,2),
    voltage DECIMAL(5,2),
    current_ma DECIMAL(8,2),
    ber DECIMAL(15,10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS smartolt_api_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_body JSONB,
    response_body JSONB,
    response_status INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configurations
INSERT INTO tr069_configurations (
    acs_server_url, acs_username, acs_password, connection_request_username, connection_request_password
) VALUES (
    'https://acs.techconnect.co.ke:7547/acs', 'acs_admin', 'acs_password_123', 'cr_user', 'cr_password_123'
) ON CONFLICT DO NOTHING;

INSERT INTO smartolt_configurations DEFAULT VALUES ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tr069_devices_device_id ON tr069_devices(device_id);
CREATE INDEX IF NOT EXISTS idx_tr069_devices_customer_id ON tr069_devices(customer_id);
CREATE INDEX IF NOT EXISTS idx_tr069_parameters_device_id ON tr069_parameters(device_id);
CREATE INDEX IF NOT EXISTS idx_tr069_tasks_device_id ON tr069_tasks(device_id);
CREATE INDEX IF NOT EXISTS idx_tr069_tasks_status ON tr069_tasks(status);

CREATE INDEX IF NOT EXISTS idx_smartolt_devices_serial_number ON smartolt_devices(serial_number);
CREATE INDEX IF NOT EXISTS idx_smartolt_devices_customer_id ON smartolt_devices(customer_id);
CREATE INDEX IF NOT EXISTS idx_smartolt_onus_serial_number ON smartolt_onus(serial_number);
CREATE INDEX IF NOT EXISTS idx_smartolt_onus_olt_device_id ON smartolt_onus(olt_device_id);
CREATE INDEX IF NOT EXISTS idx_smartolt_performance_timestamp ON smartolt_performance_history(timestamp);
