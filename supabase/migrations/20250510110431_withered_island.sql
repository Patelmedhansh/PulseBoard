/*
  # Add metrics and alerts tables

  1. New Tables
    - `metrics`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key)
      - `timestamp` (timestamptz)
      - `cpu_usage` (float)
      - `memory_usage` (float)
      - `network_rx` (float)
      - `network_tx` (float)
      
    - `alerts`
      - `id` (uuid, primary key)
      - `application_id` (uuid, foreign key)
      - `type` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  cpu_usage float NOT NULL,
  memory_usage float NOT NULL,
  network_rx float NOT NULL,
  network_tx float NOT NULL
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own metrics"
  ON metrics
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert metrics for their applications"
  ON metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read their own alerts"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX metrics_application_id_timestamp_idx ON metrics(application_id, timestamp DESC);
CREATE INDEX alerts_application_id_created_at_idx ON alerts(application_id, created_at DESC);