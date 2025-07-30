/*
  # Create environmental impact tracking

  1. New Tables
    - `environmental_actions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `action_type` (text) - transport, energy, waste, etc.
      - `description` (text)
      - `carbon_impact` (numeric) - kg CO2 saved/emitted
      - `points_earned` (integer)
      - `recorded_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `environmental_actions` table
    - Add policies for users to manage their own actions
*/

CREATE TABLE IF NOT EXISTS environmental_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action_type text NOT NULL,
  description text NOT NULL,
  carbon_impact numeric DEFAULT 0, -- positive = saved, negative = emitted
  points_earned integer DEFAULT 0 CHECK (points_earned >= 0),
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE environmental_actions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own environmental actions
CREATE POLICY "Users can read own environmental actions"
  ON environmental_actions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own environmental actions"
  ON environmental_actions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own environmental actions"
  ON environmental_actions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own environmental actions"
  ON environmental_actions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_environmental_actions_user_date 
  ON environmental_actions(user_id, recorded_at DESC);