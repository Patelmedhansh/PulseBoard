/*
  # Add Alert Configuration System

  1. New Tables
    - `alert_configs`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `type` (text) - Type of alert (cpu, memory, error_rate)
      - `threshold_value` (float) - Threshold value to trigger alert
      - `channel_type` (text) - Notification channel (webhook, email)
      - `channel_config` (jsonb) - Channel configuration (webhook URL, email address)
      - `enabled` (boolean) - Whether the alert is enabled
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their alert configs
*/

CREATE TABLE IF NOT EXISTS alert_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type text NOT NULL,
  threshold_value float NOT NULL,
  channel_type text NOT NULL,
  channel_config jsonb NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alert_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own alert configs"
  ON alert_configs
  FOR SELECT
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own alert configs"
  ON alert_configs
  FOR ALL
  TO authenticated
  USING (
    application_id IN (
      SELECT id FROM applications WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX alert_configs_application_id_idx ON alert_configs(application_id);

-- Create update trigger
CREATE TRIGGER update_alert_configs_updated_at
  BEFORE UPDATE ON alert_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();