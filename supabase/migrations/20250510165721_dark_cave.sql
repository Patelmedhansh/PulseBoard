/*
  # Update alert configurations for Prometheus integration

  1. Changes
    - Add prometheus_query field for custom Prometheus queries
    - Add evaluation_interval field for alert evaluation frequency
*/

ALTER TABLE alert_configs 
ADD COLUMN IF NOT EXISTS prometheus_query text,
ADD COLUMN IF NOT EXISTS evaluation_interval text DEFAULT '1m';