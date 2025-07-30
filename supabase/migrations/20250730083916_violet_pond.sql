/*
  # Create achievements and recommendations system

  1. New Tables
    - `achievements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `icon` (text)
      - `points_required` (integer)
      - `created_at` (timestamp)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `achievement_id` (uuid, references achievements)
      - `unlocked_at` (timestamp)

    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category` (text)
      - `title` (text)
      - `description` (text)
      - `impact_level` (text)
      - `difficulty` (text)
      - `priority_score` (integer)
      - `expires_at` (timestamp)
      - `completed` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  points_required integer DEFAULT 0 CHECK (points_required >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read achievements
CREATE POLICY "Authenticated users can read achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can read all user achievements for leaderboards
CREATE POLICY "Users can read user achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can only insert their own achievements (via functions)
CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  impact_level text DEFAULT 'medium' CHECK (impact_level IN ('low', 'medium', 'high')),
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  priority_score integer DEFAULT 50 CHECK (priority_score >= 0 AND priority_score <= 100),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own recommendations
CREATE POLICY "Users can manage own recommendations"
  ON recommendations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert default achievements
INSERT INTO achievements (title, description, category, icon, points_required) VALUES
  ('First Steps', 'Complete your first day of tracking', 'getting_started', 'footprints', 0),
  ('Eco Warrior', 'Save 10kg of CO2 through sustainable choices', 'environment', 'leaf', 500),
  ('Fitness Fanatic', 'Maintain a 30-day workout streak', 'fitness', 'activity', 1000),
  ('Wellness Champion', 'Achieve perfect health score for 7 days', 'health', 'heart', 750),
  ('Community Leader', 'Complete 5 community challenges', 'community', 'users', 1200),
  ('Goal Crusher', 'Complete 10 personal goals', 'goals', 'target', 800),
  ('Streak Master', 'Maintain a 100-day activity streak', 'consistency', 'zap', 2000)
ON CONFLICT DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_priority ON recommendations(user_id, priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_expires ON recommendations(expires_at);