/*
  # Create metrics and alerts tables

  1. New Tables
    - `metrics`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `timestamp` (timestamptz)
      - `cpu_usage` (float)
      - `memory_usage` (float)
      - `network_rx` (float)
      - `network_tx` (float)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `type` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read and insert metrics for their applications
      - Read and manage alerts for their applications

  3. Performance
    - Add indexes for efficient querying
*/

DO $$ 
BEGIN
  -- Create metrics table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'metrics') THEN
    CREATE TABLE metrics (
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
    DO $policies$
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
    END
    $policies$;

    -- Create index
    CREATE INDEX IF NOT EXISTS metrics_application_id_timestamp_idx 
    ON metrics(application_id, timestamp DESC);
  END IF;

  -- Create alerts table if it doesn't exist
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'alerts') THEN
    CREATE TABLE alerts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
      type text NOT NULL,
      message text NOT NULL,
      status text NOT NULL DEFAULT 'active',
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

    -- Create policies
    DO $policies$
    BEGIN
      IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'alerts' 
        AND policyname = 'Users can read their own alerts'
      ) THEN
        CREATE POLICY "Users can read their own alerts"
          ON alerts
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
        WHERE tablename = 'alerts' 
        AND policyname = 'Users can manage their own alerts'
      ) THEN
        CREATE POLICY "Users can manage their own alerts"
          ON alerts
          FOR ALL
          TO authenticated
          USING (
            application_id IN (
              SELECT id FROM applications WHERE user_id = auth.uid()
            )
          );
      END IF;
    END
    $policies$;

    -- Create index
    CREATE INDEX IF NOT EXISTS alerts_application_id_created_at_idx 
    ON alerts(application_id, created_at DESC);
  END IF;
END $$;