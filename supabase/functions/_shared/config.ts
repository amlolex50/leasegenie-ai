export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const MODELS = {
  GPT4: 'gpt-4o',
  GPT4_MINI: 'gpt-4o-mini'
} as const;