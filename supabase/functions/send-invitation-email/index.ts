import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from 'npm:resend@2.0.0'

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const { to, invitationId, inviterId, temporaryPassword, role } = await req.json()

    // Validate required fields
    if (!to || !invitationId || !inviterId || !temporaryPassword || !role) {
      console.error('Missing required fields:', { to, invitationId, inviterId, role });
      throw new Error('Missing required fields');
    }

    // Validate UUID format
    if (!inviterId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.error('Invalid UUID format for inviterId:', inviterId);
      throw new Error('Invalid inviterId format');
    }

    console.log('Processing invitation request:', { to, invitationId, inviterId, role });

    // Create the user in auth.users
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: to,
      password: temporaryPassword,
      email_confirm: true
    })

    if (authError) {
      console.error('Auth user creation error:', authError);
      throw authError;
    }

    console.log('Auth user created:', authUser.user.id);

    // Get inviter's name for the email
    const { data: inviterData, error: inviterError } = await supabaseClient
      .from('users')
      .select('full_name')
      .eq('id', inviterId)
      .maybeSingle();

    if (inviterError) {
      console.error('Error fetching inviter data:', inviterError);
      throw inviterError;
    }

    if (!inviterData) {
      console.error('Inviter not found:', inviterId);
      throw new Error('Inviter not found');
    }

    // Create the user profile
    const { error: profileError } = await supabaseClient
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          email: to,
          role: role,
          landlord_id: inviterId,
          full_name: to.split('@')[0] // Temporary name
        }
      ])

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    // Update invitation status
    const { error: inviteUpdateError } = await supabaseClient
      .from('invitations')
      .update({ status: 'ACCEPTED' })
      .eq('id', invitationId)

    if (inviteUpdateError) {
      console.error('Invitation update error:', inviteUpdateError);
      throw inviteUpdateError;
    }

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: 'Property Management <onboarding@resend.dev>',
      to: [to],
      subject: `You've been invited as a ${role.toLowerCase()}`,
      html: `
        <h1>Welcome to Property Management!</h1>
        <p>You've been invited by ${inviterData.full_name} to join as a ${role.toLowerCase()}.</p>
        <p>Your temporary password is: <strong>${temporaryPassword}</strong></p>
        <p>Please login and change your password as soon as possible.</p>
        <p>Best regards,<br>The Property Management Team</p>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ message: 'Invitation processed successfully' }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error processing invitation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400,
      }
    )
  }
})