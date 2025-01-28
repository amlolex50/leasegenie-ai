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
    const { urls, leaseId } = await req.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error('No URLs provided')
    }

    // Get the authenticated user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] ?? ''
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Call the document processing endpoint
    const response = await fetch('https://us-central1-note-maply-57akxp.cloudfunctions.net/extract_text_from_images_or_docs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_urls: urls,
        owner_id: user.id
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to process documents: ${response.statusText}`)
    }

    const result = await response.json()

    // Update the lease with the processed text if available
    if (result.aggregate_text && leaseId) {
      const { error: updateError } = await supabase
        .from('leases')
        .update({ 
          insights: {
            processed_text: result.aggregate_text,
            processed_at: new Date().toISOString(),
            num_chunks: result.num_chunks
          }
        })
        .eq('id', leaseId)

      if (updateError) {
        console.error('Error updating lease:', updateError)
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in process-lease-documents function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})