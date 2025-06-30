-- Create social tokens table for storing OAuth tokens per client
CREATE TABLE IF NOT EXISTS client_social_tokens (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  permissions TEXT[],
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255),
  last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one token per client per platform
  UNIQUE(client_id, platform)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_client_id ON client_social_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_platform ON client_social_tokens(platform);
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_expires_at ON client_social_tokens(expires_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_social_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_social_tokens_updated_at
  BEFORE UPDATE ON client_social_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_client_social_tokens_updated_at();
