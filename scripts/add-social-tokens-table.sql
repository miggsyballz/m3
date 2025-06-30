-- Create client_social_tokens table for storing OAuth tokens per client
CREATE TABLE IF NOT EXISTS client_social_tokens (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  permissions JSONB DEFAULT '[]'::jsonb,
  platform_user_id VARCHAR(255),
  platform_username VARCHAR(255),
  last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, platform)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_client_id ON client_social_tokens(client_id);
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_platform ON client_social_tokens(platform);
CREATE INDEX IF NOT EXISTS idx_client_social_tokens_expires_at ON client_social_tokens(expires_at);
