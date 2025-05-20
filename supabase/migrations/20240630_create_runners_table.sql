-- Create runners table
CREATE TABLE IF NOT EXISTS runners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  repo_url TEXT,
  org_url TEXT,
  github_connection_id UUID REFERENCES github_connections NOT NULL,
  installation_id TEXT NOT NULL,
  deployment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  minutes_used INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users NOT NULL
);

-- Add RLS policies
ALTER TABLE runners ENABLE ROW LEVEL SECURITY;

-- Users can read their own runners
CREATE POLICY "Users can view their own runners"
  ON runners
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own runners
CREATE POLICY "Users can insert their own runners"
  ON runners
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
-- Users can update their own runners
CREATE POLICY "Users can update their own runners"
  ON runners
  FOR UPDATE
  USING (auth.uid() = user_id);
  
-- Users can delete their own runners
CREATE POLICY "Users can delete their own runners"
  ON runners
  FOR DELETE
  USING (auth.uid() = user_id); 