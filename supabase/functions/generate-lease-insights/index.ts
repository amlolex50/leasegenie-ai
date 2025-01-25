import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leaseId } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch lease details
    const { data: lease, error: leaseError } = await supabaseClient
      .from('leases')
      .select(`
        *,
        tenant:tenant_id(full_name),
        unit:unit_id(
          unit_name,
          property:property_id(name)
        )
      `)
      .eq('id', leaseId)
      .single();

    if (leaseError) throw leaseError;

    // Calculate insights
    const leaseStartDate = new Date(lease.lease_start_date);
    const leaseEndDate = new Date(lease.lease_end_date);
    const leaseDuration = Math.round((leaseEndDate.getTime() - leaseStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    const monthlyRent = lease.monthly_rent;
    const totalValue = monthlyRent * leaseDuration;
    
    const insights = {
      leaseDuration: {
        months: leaseDuration,
        description: `${leaseDuration} month lease term`
      },
      financials: {
        monthlyRent: monthlyRent,
        totalValue: totalValue,
        description: `Total lease value: $${totalValue.toLocaleString()}`
      },
      property: {
        name: lease.unit.property.name,
        unit: lease.unit.unit_name,
        description: `${lease.unit.unit_name} at ${lease.unit.property.name}`
      },
      tenant: {
        name: lease.tenant.full_name,
        description: `Leased to ${lease.tenant.full_name}`
      }
    };

    // Update lease with insights
    const { error: updateError } = await supabaseClient
      .from('leases')
      .update({ insights })
      .eq('id', leaseId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating lease insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});