import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get request body
    const { urls, leaseId } = await req.json()
    console.log('Processing documents for lease:', leaseId, 'URLs:', urls)

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error('No URLs provided')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Call the document processing endpoint using DEEPSEEK API
    const response = await fetch('https://api.deepseek.com/v1/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
      },
      body: JSON.stringify({
        urls: urls,
        owner_id: user.id
      })
    })

    if (!response.ok) {
      console.error('Deepseek API error:', await response.text())
      throw new Error('Failed to process document with Deepseek API')
    }

    const result = await response.json()
    console.log('Document processing result:', result)

    // Update the lease with the processed insights
    if (result.insights && leaseId) {
      const { error: updateError } = await supabase
        .from('leases')
        .update({ insights: result.insights })
        .eq('id', leaseId)

      if (updateError) {
        console.error('Error updating lease:', updateError)
        throw new Error('Failed to update lease with insights')
      }
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in process-lease-documents function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})