import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText, leaseId } = await req.json();

    if (!documentText) {
      throw new Error('No document text provided');
    }

    console.log('Processing lease insights for lease:', leaseId);
    console.log('Document text length:', documentText.length);

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a lease document analyzer. Extract key insights from the lease document text provided. 
    Format the response as a JSON object with the following structure, and ONLY return the JSON object with no markdown formatting or additional text:
    {
      "leaseDuration": {
        "startDate": "YYYY-MM-DD",
        "endDate": "YYYY-MM-DD",
        "totalMonths": number,
        "description": "string"
      },
      "financials": {
        "monthlyRent": number,
        "depositAmount": number,
        "escalationRate": number,
        "description": "string"
      },
      "property": {
        "description": "string",
        "responsibilities": ["string"],
        "restrictions": ["string"]
      },
      "tenant": {
        "description": "string",
        "responsibilities": ["string"],
        "restrictions": ["string"]
      }
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Extract insights from this lease document: ${documentText}` }
        ],
        temperature: 0.3, // Lower temperature for more consistent, focused responses
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to analyze lease document');
    }

    const data = await response.json();
    const insights = JSON.parse(data.choices[0].message.content);
    
    console.log('Successfully generated insights:', insights);

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-lease-insights function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});