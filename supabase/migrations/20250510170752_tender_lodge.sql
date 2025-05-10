/*
  # Metrics Table Setup

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
    - Add policies for authenticated users to:
      - Read their own metrics
      - Insert metrics for their applications

  3. Performance
    - Add index for timestamp-based queries
*/

-- Create metrics table if it doesn't exist
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

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'metrics' 
    AND policyname = 'Users can read their own metrics'
  ) THEN
    CREATE POLICY "Users can read their own metrics"
      ON metrics
      FOR SELECT
      TO authenticated
      USING (
        application_id IN (
          SELECT id FROM applications WHERE user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'metrics' 
    AND policyname = 'Users can insert metrics for their applications'
  ) THEN
    CREATE POLICY "Users can insert metrics for their applications"
      ON metrics
      FOR INSERT
      TO authenticated
      WITH CHECK (
        application_id IN (
          SELECT id FROM applications WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS metrics_application_id_timestamp_idx 
ON metrics(application_id, timestamp DESC);