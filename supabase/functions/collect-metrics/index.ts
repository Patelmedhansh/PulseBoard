import { createClient } from 'npm:@supabase/supabase-js@2.38.4';
import { parse } from 'npm:prom-client@14.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    const { application_id, metrics_text } = await req.json();

    if (!application_id || !metrics_text) {
      throw new Error('Missing required fields');
    }

    // Parse Prometheus metrics
    const parsedMetrics = parse(metrics_text);
    
    // Extract common metrics
    const metrics = {
      cpu_usage: parsedMetrics.find(m => m.name === 'process_cpu_usage')?.value || 0,
      memory_usage: parsedMetrics.find(m => m.name === 'process_resident_memory_bytes')?.value || 0,
      network_rx: parsedMetrics.find(m => m.name === 'process_network_rx_bytes')?.value || 0,
      network_tx: parsedMetrics.find(m => m.name === 'process_network_tx_bytes')?.value || 0,
    };

    // Store metrics in Supabase
    const { error } = await supabaseClient
      .from('metrics')
      .insert({
        application_id,
        ...metrics,
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true }),
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