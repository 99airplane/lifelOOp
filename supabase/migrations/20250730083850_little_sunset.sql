/*
  # Create health metrics tracking

  1. New Tables
    - `health_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `metric_type` (text) - heart_rate, steps, sleep_hours, etc.
      - `value` (numeric)
      - `unit` (text)
      - `recorded_at` (timestamp)
      - `source` (text) - manual, wearable, app, etc.
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `health_metrics` table
    - Add policies for users to manage their own metrics
*/

CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Users can manage their own health metrics
CREATE POLICY "Users can read own health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health metrics"
  ON health_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health metrics"
  ON health_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health metrics"
  ON health_metrics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for efficient queries
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_type_date 
  ON health_metrics(user_id, metric_type, recorded_at DESC);