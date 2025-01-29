import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.20.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentUrl, leaseId } = await req.json()
    console.log('Creating embeddings for lease:', leaseId, 'URL:', documentUrl)

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

    // Get lease details to get tenant ID
    const { data: leaseData, error: leaseError } = await supabase
      .from('leases')
      .select('tenant_id')
      .eq('id', leaseId)
      .single()

    if (leaseError || !leaseData) {
      throw new Error('Failed to fetch lease details')
    }

    // Download the document content
    const response = await fetch(documentUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch document content')
    }
    const documentText = await response.text()

    // Check for OpenAI API key
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAiApiKey) {
      throw new Error('OPENAI_API_KEY is not configured')
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: openAiApiKey,
    })
    const openai = new OpenAIApi(configuration)

    console.log('Creating embeddings...')
    // Create embeddings
    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: documentText,
    })

    if (!embeddingResponse.data.data || embeddingResponse.data.data.length === 0) {
      throw new Error('Failed to generate embeddings')
    }

    const [{ embedding }] = embeddingResponse.data.data

    console.log('Storing embeddings in vectorstore...')
    // Store in vectorstore with both owner (uploader) and tenant IDs
    const { error: insertError } = await supabase
      .from('vectorstore')
      .insert({
        owner_id: user.id,
        content: documentText,
        embedding: embedding,
        metadata: {
          type: 'lease_document',
          lease_id: leaseId,
          tenant_id: leaseData.tenant_id,
          url: documentUrl
        }
      })

    if (insertError) {
      console.error('Error storing embedding:', insertError)
      throw new Error('Failed to store document embedding')
    }

    return new Response(
      JSON.stringify({ message: 'Document embeddings stored successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in store-document-embeddings function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})