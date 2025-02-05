import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const body = await req.text();
    const { to, invitationId, inviterId, temporaryPassword, role } = JSON.parse(body);

    // Log received data
    console.log('Received data:', { to, invitationId, inviterId, role });

    // Validate required fields
    if (!to || !invitationId || !inviterId || !temporaryPassword || !role) {
      const missingFields = { to, invitationId, inviterId, temporaryPassword, role };
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: missingFields 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Validate UUID format for inviterId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(inviterId)) {
      console.error('Invalid UUID format for inviterId:', inviterId);
      return new Response(
        JSON.stringify({ error: 'Invalid inviterId format' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      );
    }

    // Get inviter's name
    const { data: inviterData, error: inviterError } = await supabaseClient
      .from('users')
      .select('full_name')
      .eq('id', inviterId)
      .maybeSingle();

    if (inviterError) {
      console.error('Error fetching inviter data:', inviterError);
      throw inviterError;
    }

    const inviterName = inviterData?.full_name || 'Property Manager';

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'Property Management <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited as a ${role.toLowerCase()}`,
      html: `
        <h1>Welcome to Property Management!</h1>
        <p>You've been invited by ${inviterName} to join as a ${role.toLowerCase()}.</p>
        <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
        <p>Please login and change your password as soon as possible.</p>
        <p>Best regards,<br>The Property Management Team</p>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ message: 'Invitation email sent successfully' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-invitation-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    );
  }
});