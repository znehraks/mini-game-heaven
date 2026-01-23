-- Mini-Game Heaven Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id TEXT UNIQUE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  max_score INTEGER DEFAULT 999999,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_id TEXT REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  nickname TEXT NOT NULL,
  score INTEGER NOT NULL,
  duration_ms INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  validated BOOLEAN DEFAULT false
);

-- Push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores(game_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_user ON push_subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Can read and update own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Games: Anyone can read
CREATE POLICY "Anyone can read games" ON games
  FOR SELECT TO authenticated, anon USING (true);

-- Scores: Anyone can read, anyone can insert
CREATE POLICY "Anyone can read scores" ON scores
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Anyone can insert scores" ON scores
  FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Push subscriptions: Users can manage own subscriptions
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial game data
INSERT INTO games (id, name, description, thumbnail, max_score, config) VALUES
  ('neon-tower', 'Neon Tower Stack', 'Stack blocks to build the tallest neon tower!', '/games/neon-tower/thumbnail.png', 999999, '{"difficulty": "medium", "blockSpeed": 2}'::jsonb),
  ('gravity-switcher', 'Gravity Switcher', 'Switch gravity to navigate through obstacles!', '/games/gravity-switcher/thumbnail.png', 999999, '{"difficulty": "medium", "obstacleSpeed": 3}'::jsonb),
  ('color-rush', 'Color Rush', 'Match colors as fast as you can!', '/games/color-rush/thumbnail.png', 999999, '{"difficulty": "medium", "timeLimit": 60}'::jsonb)
ON CONFLICT (id) DO NOTHING;
