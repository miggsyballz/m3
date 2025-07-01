-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    hashtags TEXT,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_client_id ON scheduled_posts(client_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_deleted_at ON scheduled_posts(deleted_at);

-- Insert some sample data for testing
INSERT INTO scheduled_posts (content, platform, scheduled_for, status, hashtags, client_id) 
SELECT 
    'Sample post content for ' || c.name,
    'instagram',
    NOW() + INTERVAL '1 day',
    'scheduled',
    '#marketing #socialmedia',
    c.id
FROM clients c
WHERE c.deleted_at IS NULL
LIMIT 1;
