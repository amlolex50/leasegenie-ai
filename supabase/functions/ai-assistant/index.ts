import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    // Fetch relevant data from Supabase
    const { data: leases } = await supabase
      .from('leases')
      .select(`
        *,
        units:unit_id(
          unit_name,
          property:property_id(name)
        ),
        tenant:tenant_id(full_name)
      `)
      .eq('tenant_id', userId);

    const { data: maintenanceRequests } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        lease:lease_id(
          units:unit_id(unit_name)
        )
      `)
      .eq('submitted_by', userId);

    const { data: payments } = await supabase
      .from('payments')
      .select(`
        *,
        lease:lease_id(
          monthly_rent,
          units:unit_id(unit_name)
        )
      `)
      .order('due_date', { ascending: true })
      .limit(5);

    // Create context for the AI
    const context = `
      You are LeaseGenie, a property management assistant. Here's the current context:
      
      Leases: ${JSON.stringify(leases)}
      Maintenance Requests: ${JSON.stringify(maintenanceRequests)}
      Recent Payments: ${JSON.stringify(payments)}
      
      Please provide accurate information based on this data. If you don't have specific information, say so.
    `;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('DeepSeek API Response:', data);

    return new Response(JSON.stringify({
      response: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});