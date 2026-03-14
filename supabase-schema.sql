-- XPS Intelligence Control Plane Database Schema
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. Admin Allowlist Table
-- =====================================================
-- Stores emails of users authorized to access admin features
CREATE TABLE IF NOT EXISTS xps_admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add your admin email (REPLACE WITH YOUR EMAIL)
INSERT INTO xps_admins (email) 
VALUES ('your-email@example.com')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- 2. Integration Metadata Table
-- =====================================================
-- Stores non-sensitive integration configuration
-- DO NOT store secrets here - use xps_vault_secrets instead
CREATE TABLE IF NOT EXISTS xps_integrations (
  integration_id TEXT PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  status JSONB DEFAULT '{"connected": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_integrations_owner 
ON xps_integrations(owner_user_id);

-- Index for provider queries
CREATE INDEX IF NOT EXISTS idx_integrations_provider 
ON xps_integrations(provider);

-- =====================================================
-- 3. Vault Secrets Table
-- =====================================================
-- Stores encrypted secrets (tokens, API keys, etc.)
-- Access should be restricted to service role only
CREATE TABLE IF NOT EXISTS xps_vault_secrets (
  integration_id TEXT PRIMARY KEY,
  owner_user_id UUID NOT NULL,
  secret_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (integration_id) 
    REFERENCES xps_integrations(integration_id) 
    ON DELETE CASCADE
);

-- Index for faster user queries
CREATE INDEX IF NOT EXISTS idx_vault_secrets_owner 
ON xps_vault_secrets(owner_user_id);

-- =====================================================
-- 4. Audit Log Table
-- =====================================================
-- Tracks all integration actions for security and debugging
CREATE TABLE IF NOT EXISTS xps_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL,
  integration_id TEXT,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_audit_log_created 
ON xps_audit_log(created_at DESC);

-- Index for user-based queries
CREATE INDEX IF NOT EXISTS idx_audit_log_owner 
ON xps_audit_log(owner_user_id);

-- Index for integration-based queries
CREATE INDEX IF NOT EXISTS idx_audit_log_integration 
ON xps_audit_log(integration_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE xps_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE xps_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE xps_vault_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE xps_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin table: Only service role can access
CREATE POLICY "Service role can manage admins"
ON xps_admins FOR ALL
TO service_role
USING (true);

-- Integrations: Users can only see their own
CREATE POLICY "Users can view own integrations"
ON xps_integrations FOR SELECT
TO authenticated
USING (auth.uid() = owner_user_id);

CREATE POLICY "Service role can manage all integrations"
ON xps_integrations FOR ALL
TO service_role
USING (true);

-- Vault secrets: Only service role can access (never expose to client)
CREATE POLICY "Service role can manage secrets"
ON xps_vault_secrets FOR ALL
TO service_role
USING (true);

-- Audit log: Users can view their own logs, service role can view all
CREATE POLICY "Users can view own audit logs"
ON xps_audit_log FOR SELECT
TO authenticated
USING (auth.uid() = owner_user_id);

CREATE POLICY "Service role can manage audit logs"
ON xps_audit_log FOR ALL
TO service_role
USING (true);

-- =====================================================
-- Helper Functions (Optional)
-- =====================================================

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM xps_admins WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log an audit event
CREATE OR REPLACE FUNCTION log_audit_event(
  p_owner_user_id UUID,
  p_integration_id TEXT,
  p_event_type TEXT,
  p_payload JSONB
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO xps_audit_log (
    owner_user_id,
    integration_id,
    event_type,
    payload
  ) VALUES (
    p_owner_user_id,
    p_integration_id,
    p_event_type,
    p_payload
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Verification Queries
-- =====================================================

-- Check if tables were created successfully
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'xps_%'
ORDER BY tablename;

-- Verify admin was inserted
SELECT * FROM xps_admins;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Replace 'your-email@example.com' with your actual admin email
-- 2. Service role key should NEVER be exposed to the client
-- 3. All API endpoints should use service role to access these tables
-- 4. Vault secrets are encrypted at rest by Supabase
-- 5. RLS policies ensure users can only access their own data
