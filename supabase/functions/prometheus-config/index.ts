import { createClient } from 'npm:@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Get all active applications
    const { data: apps, error } = await supabaseClient
      .from('applications')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    // Generate Prometheus scrape config
    const config = {
      global: {
        scrape_interval: '15s',
        evaluation_interval: '15s',
      },
      scrape_configs: apps.map((app) => ({
        job_name: app.name,
        static_configs: [{
          targets: [new URL(app.metrics_endpoint).host],
          labels: {
            app: app.name,
            app_id: app.id,
          },
        }],
        metrics_path: new URL(app.metrics_endpoint).pathname,
      })),
    };

    return new Response(JSON.stringify(config), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});