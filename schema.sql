-- Lead Management System Database Schema
-- PostgreSQL

-- Drop table if it exists (for clean re-init)
DROP TABLE IF EXISTS leads;

-- Create leads table
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL CHECK (source IN ('Call', 'WhatsApp', 'Field')),
    status VARCHAR(20) NOT NULL DEFAULT 'Interested'
        CHECK (status IN ('Interested', 'Not Interested', 'Converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on status for faster filtering
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Trigger to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Seed sample data for testing
INSERT INTO leads (name, phone, source, status) VALUES
    ('Rahul Sharma', '9876543210', 'Call', 'Interested'),
    ('Priya Verma', '9123456780', 'WhatsApp', 'Converted'),
    ('Amit Singh', '9988776655', 'Field', 'Not Interested'),
    ('Sneha Iyer', '9001122334', 'WhatsApp', 'Interested');
