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
    // Parse the request body
    const { documentUrl } = await req.json()

    if (!documentUrl) {
      throw new Error('No document URL provided')
    }

    console.log('Processing document:', documentUrl)

    // Call the cloud function to extract text
    const response = await fetch('https://us-central1-note-maply-57akxp.cloudfunctions.net/process_images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_urls: [documentUrl]
      })
    })

    if (!response.ok) {
      throw new Error(`Cloud function error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Extracted text:', data.aggregate_text)

    return new Response(
      JSON.stringify({
        success: true,
        text: data.aggregate_text
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing document:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})