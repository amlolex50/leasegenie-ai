import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
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
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
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
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
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

    // Generate the invitation link
    const baseUrl = 'https://app.lovable.dev'; // Replace with your actual frontend URL
    const invitationLink = `${baseUrl}/invitation/${invitationId}`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'ManageLease <manageleaseai@estate.teachai.io>',
      to: [to],
      subject: `You've been invited to ManageLeaseAI!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; margin-bottom: 20px;">Welcome to ManageLeaseAI!</h1>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            ${inviterName} has invited you to join their property management system as a ${role.toLowerCase()}.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 15px;">
            Your temporary password is: <strong>${temporaryPassword}</strong>
          </p>
          <div style="margin: 30px 0;">
            <a href="${invitationLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            This invitation will expire in 7 days.
          </p>
          <p style="font-size: 14px; color: #666;">
            Please change your password after your first login.
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ message: 'Invitation email sent successfully' }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-invitation-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        },
        status: 500,
      }
    );
  }
});