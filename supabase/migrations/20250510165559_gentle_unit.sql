/*
  # Remove metrics table and update alert configs
  
  1. Changes:
    - Remove metrics table as metrics will be stored in Prometheus
    - Update alert_configs to work with Prometheus queries
*/

DROP TABLE IF EXISTS metrics;

-- Update alert_configs to support Prometheus queries
ALTER TABLE alert_configs 
ADD COLUMN IF NOT EXISTS prometheus_query text,
ADD COLUMN IF NOT EXISTS evaluation_interval text DEFAULT '1m';