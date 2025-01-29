import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@4.20.1'
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function extractTextFromPDF(url: string): Promise<string> {
  console.log('Downloading PDF from URL:', url)
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  
  console.log('Loading PDF document')
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item: any) => item.str).join(' ')
    fullText += pageText + '\n'
  }
  
  console.log('PDF text extraction complete')
  return fullText
}

async function processWithDeepseek(text: string, userId: string): Promise<any> {
  const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }

  console.log('Calling Deepseek API...')
  const response = await fetch('https://api.deepseek.com/v1/extract', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      owner_id: userId
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Deepseek API error response:', errorText)
    throw new Error(`Deepseek API failed with status ${response.status}: ${errorText}`)
  }

  return await response.json()
}

async function processWithOpenAI(text: string): Promise<any> {
  const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const configuration = new Configuration({
    apiKey: openAiApiKey,
  })
  const openai = new OpenAIApi(configuration)

  console.log('Processing with OpenAI as fallback...')
  const completion = await openai.createChatCompletion({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a lease document analyzer. Extract and structure the following information from the lease document: lease duration (start date, end date, total months), financials (monthly rent, deposit amount, escalation rate), property details (description, responsibilities, restrictions), and tenant information (description, responsibilities, restrictions). Format the response as a JSON object."
      },
      {
        role: "user",
        content: text
      }
    ]
  })

  const insights = JSON.parse(completion.data.choices[0].message.content)
  return { insights }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
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

    // Extract text from PDF
    const documentText = await extractTextFromPDF(urls[0])
    
    // Try Deepseek first, fallback to OpenAI if it fails
    let result
    try {
      result = await processWithDeepseek(documentText, user.id)
    } catch (deepseekError) {
      console.warn('Deepseek processing failed, falling back to OpenAI:', deepseekError)
      result = await processWithOpenAI(documentText)
    }

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
      JSON.stringify({ ...result, text: documentText }),
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