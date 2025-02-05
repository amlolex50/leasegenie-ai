import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { to, invitationId, inviterName, temporaryPassword, role } = await req.json()

    // Create the user in auth.users
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: to,
      password: temporaryPassword,
      email_confirm: true
    })

    if (authError) throw authError

    // Create the user profile
    const { error: profileError } = await supabaseClient
      .from('users')
      .insert([
        {
          id: authUser.user.id,
          email: to,
          role: role,
          landlord_id: inviterName // This should be the landlord's ID
        }
      ])

    if (profileError) throw profileError

    // Update invitation status
    const { error: inviteUpdateError } = await supabaseClient
      .from('invitations')
      .update({ status: 'ACCEPTED' })
      .eq('id', invitationId)

    if (inviteUpdateError) throw inviteUpdateError

    // Here you would typically send an email with the temporary password
    // For now, we'll just return success
    return new Response(
      JSON.stringify({ message: 'Invitation processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})