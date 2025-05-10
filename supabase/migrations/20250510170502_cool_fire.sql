/*
  # Create metrics table for storing application metrics

  1. New Tables
    - `metrics`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `timestamp` (timestamptz)
      - `cpu_usage` (float)
      - `memory_usage` (float)
      - `network_rx` (float)
      - `network_tx` (float)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL DEFAULT now(),
  cpu_usage float NOT NULL,
  memory_usage float NOT NULL,
  network_rx float NOT NULL,
  network_tx float NOT NULL
);

-- Enable RLS
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

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

-- Create index for better query performance
CREATE INDEX metrics_application_id_timestamp_idx ON metrics(application_id, timestamp DESC);