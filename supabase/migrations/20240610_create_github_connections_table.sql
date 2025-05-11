-- Create GitHub connections table
CREATE TABLE IF NOT EXISTS github_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_org_id TEXT NOT NULL,
  github_org_name TEXT NOT NULL,
  github_org_avatar_url TEXT,
  github_installation_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, github_org_id)
);

-- Add RLS policies
ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;

-- Users can read their own connections
CREATE POLICY "Users can view their own github connections"
  ON github_connections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert their own github connections"
  ON github_connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
  
-- Users can update their own connections
CREATE POLICY "Users can update their own github connections"
  ON github_connections
  FOR UPDATE
  USING (auth.uid() = user_id);
  
-- Users can delete their own connections
CREATE POLICY "Users can delete their own github connections"
  ON github_connections
  FOR DELETE
  USING (auth.uid() = user_id); 