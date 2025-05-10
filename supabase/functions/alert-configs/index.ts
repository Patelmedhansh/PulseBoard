import { createClient } from 'npm:@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize Supabase client
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get all enabled alert configurations
    const { data, error } = await supabaseClient
      .from('alert_configs')
      .select(`
        id,
        type,
        threshold_value,
        channel_type,
        channel_config,
        applications (
          name,
          metrics_endpoint
        )
      `)
      .eq('enabled', true);

    if (error) throw error;

    // Format data for Alertmanager
    const alertRules = data.map((config) => ({
      alert: `${config.applications.name}_${config.type}`,
      expr: generatePrometheusQuery(config),
      labels: {
        severity: 'warning',
        app: config.applications.name,
      },
      annotations: {
        summary: `${config.type} alert for ${config.applications.name}`,
        description: generateAlertDescription(config),
      },
    }));

    return new Response(
      JSON.stringify(alertRules),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function generatePrometheusQuery(config: any): string {
  switch (config.type) {
    case 'cpu':
      return `cpu_usage{app="${config.applications.name}"} > ${config.threshold_value}`;
    case 'memory':
      return `memory_usage{app="${config.applications.name}"} > ${config.threshold_value}`;
    case 'error_rate':
      return `rate(http_requests_total{app="${config.applications.name}",status=~"5.."}[5m]) > ${config.threshold_value}`;
    default:
      return '';
  }
}

function generateAlertDescription(config: any): string {
  switch (config.type) {
    case 'cpu':
      return `CPU usage is above ${config.threshold_value}%`;
    case 'memory':
      return `Memory usage is above ${config.threshold_value}%`;
    case 'error_rate':
      return `Error rate is above ${config.threshold_value} errors per minute`;
    default:
      return '';
  }
}