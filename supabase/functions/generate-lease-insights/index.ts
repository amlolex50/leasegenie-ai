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
    console.log('Processing lease insights for lease:', leaseId);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch lease details including the PDF URL
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

    if (leaseError) {
      console.error('Error fetching lease:', leaseError);
      throw leaseError;
    }

    if (!lease.pdf_url) {
      throw new Error('No PDF found for this lease');
    }

    // Get the signed URL for the PDF
    const { data: { signedUrl }, error: signedUrlError } = await supabaseClient
      .storage
      .from('lease_documents')
      .createSignedUrl(lease.pdf_url, 60); // URL valid for 60 seconds

    if (signedUrlError) {
      console.error('Error getting signed URL:', signedUrlError);
      throw signedUrlError;
    }

    console.log('Got signed URL for PDF, calling deepseek API');

    // Call the deepseek API
    const deepseekResponse = await fetch('https://us-central1-schoolgpt.cloudfunctions.net/process_file_and_query_deepseek', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: signedUrl,
        content: "Please analyze this lease document and provide the following insights: 1) Lease duration and key dates, 2) Financial details including monthly rent and any escalation rates, 3) Property and unit details, 4) Tenant information and key responsibilities. Format the response in a clear, structured way."
      })
    });

    if (!deepseekResponse.ok) {
      console.error('Deepseek API error:', await deepseekResponse.text());
      throw new Error('Failed to process lease document');
    }

    const aiResponse = await deepseekResponse.json();
    console.log('Got AI response:', aiResponse);

    // Structure the insights
    const insights = {
      leaseDuration: {
        months: lease.lease_end_date 
          ? Math.round((new Date(lease.lease_end_date).getTime() - new Date(lease.lease_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
          : 0,
        description: aiResponse.summary || "Lease duration information not available"
      },
      financials: {
        monthlyRent: lease.monthly_rent,
        totalValue: lease.monthly_rent * (lease.lease_end_date 
          ? Math.round((new Date(lease.lease_end_date).getTime() - new Date(lease.lease_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
          : 0),
        description: aiResponse.summary || "Financial details not available"
      },
      property: {
        name: lease.unit.property.name,
        unit: lease.unit.unit_name,
        description: aiResponse.summary || "Property details not available"
      },
      tenant: {
        name: lease.tenant.full_name,
        description: aiResponse.summary || "Tenant information not available"
      }
    };

    // Update the lease with the insights
    const { error: updateError } = await supabaseClient
      .from('leases')
      .update({ insights })
      .eq('id', leaseId);

    if (updateError) {
      console.error('Error updating lease with insights:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating lease insights:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});