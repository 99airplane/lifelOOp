/*
  # Create goals and challenges system

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `target_value` (numeric)
      - `current_value` (numeric, default 0)
      - `unit` (text)
      - `deadline` (date)
      - `status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `challenges`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `difficulty` (text)
      - `points_reward` (integer)
      - `start_date` (date)
      - `end_date` (date)
      - `max_participants` (integer)
      - `created_at` (timestamp)

    - `challenge_participants`
      - `id` (uuid, primary key)
      - `challenge_id` (uuid, references challenges)
      - `user_id` (uuid, references profiles)
      - `progress` (numeric, default 0)
      - `completed` (boolean, default false)
      - `joined_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  target_value numeric NOT NULL CHECK (target_value > 0),
  current_value numeric DEFAULT 0 CHECK (current_value >= 0),
  unit text NOT NULL,
  deadline date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON goals
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  points_reward integer DEFAULT 100 CHECK (points_reward >= 0),
  start_date date DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  max_participants integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read challenges
CREATE POLICY "Authenticated users can read challenges"
  ON challenges
  FOR SELECT
  TO authenticated
  USING (true);

-- Challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

-- Users can read all participants for leaderboards
CREATE POLICY "Users can read challenge participants"
  ON challenge_participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can manage their own participation
CREATE POLICY "Users can manage own participation"
  ON challenge_participants
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants(challenge_id);