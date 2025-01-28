import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();

    console.log('Searching vectorstore for relevant context...');

    // Query the vectorstore for relevant documents
    const { data: relevantDocs, error: searchError } = await supabase.rpc('match_documents', {
      query_embedding: message,  // We'll use the text directly since we don't have an embedding model
      match_threshold: 0.7,     // Adjust this threshold as needed
      match_count: 5,          // Get top 5 most relevant documents
      user_id: userId
    });

    if (searchError) {
      console.error('Error searching vectorstore:', searchError);
      throw searchError;
    }

    // Combine relevant documents into context
    const context = relevantDocs
      ? relevantDocs.map((doc: any) => doc.content).join('\n\n')
      : '';

    console.log('Retrieved context:', context);

    // Create the prompt with context
    const systemPrompt = `You are LeaseGenie, a property management assistant. Use the following context to answer the user's question. If the context doesn't contain relevant information, say so.

Context:
${context}

Answer the question based on the context above. If you cannot find relevant information in the context, say so clearly.`;

    console.log('Calling DeepSeek API with context...');

    // Call DeepSeek API with the enhanced context
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        stream: false,
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