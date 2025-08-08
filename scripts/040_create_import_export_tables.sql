-- Tables for customer import/export functionality

-- Import/Export jobs tracking
CREATE TABLE IF NOT EXISTS import_export_jobs (
    id SERIAL PRIMARY KEY,
    job_type VARCHAR(20) NOT NULL, -- 'import' or 'export'
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    file_name VARCHAR(255),
    file_size BIGINT,
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    
    -- Configuration
    source_system VARCHAR(100), -- 'splynx', 'manual', etc.
    field_mapping JSON,
    import_options JSON,
    
    -- Results
    error_log TEXT,
    summary_report JSON,
    
    -- Metadata
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Import errors log
CREATE TABLE IF NOT EXISTS import_errors (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES import_export_jobs(id),
    row_number INTEGER,
    field_name VARCHAR(255),
    field_value TEXT,
    error_message TEXT,
    error_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Field mapping templates for different systems
CREATE TABLE IF NOT EXISTS field_mapping_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    mapping_config JSON NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default Splynx field mapping template
INSERT INTO field_mapping_templates (template_name, source_system, mapping_config, is_default) VALUES
('Splynx Default Mapping', 'splynx', '{
    "customer_name": "first_name",
    "email": "email", 
    "phone_number": "phone",
    "address": "physical_address",
    "service_plan": "service_plan_name",
    "status": "status",
    "account_balance": "account_balance",
    "login_id": "portal_login_id",
    "password": "portal_password",
    "ip_address": "static_ip",
    "mac_address": "mac_address",
    "connection_date": "activation_date",
    "last_payment": "last_payment_date",
    "monthly_fee": "monthly_fee",
    "notes": "notes"
}', true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_import_export_jobs_status ON import_export_jobs(status);
CREATE INDEX IF NOT EXISTS idx_import_export_jobs_created_at ON import_export_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_import_errors_job_id ON import_errors(job_id);
