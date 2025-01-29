import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import OpenAI from "https://esm.sh/openai@4.20.1"
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function extractTextFromPDF(url: string): Promise<string> {
  console.log('Downloading PDF from URL:', url)
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }
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
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error(`Failed to extract text from PDF: ${error.message}`)
  }
}

async function processWithDeepseek(text: string, userId: string): Promise<any> {
  const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY')
  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured')
  }

  console.log('Calling Deepseek API...')
  try {
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
      throw new Error(`Deepseek API failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('Deepseek processing successful')
    return data
  } catch (error) {
    console.error('Deepseek processing failed:', error)
    throw error
  }
}

async function processWithOpenAI(text: string): Promise<any> {
  const openAiApiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openAiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const openai = new OpenAI({ apiKey: openAiApiKey })

  console.log('Processing with OpenAI...')
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
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

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('No content in OpenAI response')
    }

    try {
      const insights = JSON.parse(content)
      console.log('OpenAI processing successful')
      return { insights }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      throw new Error('Failed to parse OpenAI response as JSON')
    }
  } catch (error) {
    console.error('OpenAI processing failed:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      } 
    })
  }

  try {
    // Log request details
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    // Get and validate content type
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }

    // Get the raw body text and parse it
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Parsed request body:', requestBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      throw new Error(`Invalid JSON in request body: ${error.message}`);
    }

    // Validate required fields
    const { urls, leaseId } = requestBody;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new Error('No URLs provided in request body');
    }

    if (!leaseId) {
      throw new Error('No lease ID provided in request body');
    }

    console.log('Processing documents for lease:', leaseId);
    console.log('URLs to process:', urls);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Authenticate user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Extract text from PDF
    const documentText = await extractTextFromPDF(urls[0])
    if (!documentText) {
      throw new Error('No text extracted from document')
    }
    
    // Process document
    let result;
    try {
      result = await processWithDeepseek(documentText, user.id)
    } catch (deepseekError) {
      console.warn('Deepseek processing failed, falling back to OpenAI:', deepseekError)
      result = await processWithOpenAI(documentText)
    }

    console.log('Document processing result:', result)

    // Update lease with insights
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
      JSON.stringify({ 
        success: true, 
        ...result, 
        text: documentText 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in process-lease-documents function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred'
      }),
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