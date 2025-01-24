import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  inviterName: string;
  invitationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received email request");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { to, inviterName, invitationId } = await req.json() as EmailRequest;
    console.log("Parsed request data:", { to, inviterName, invitationId });

    const emailData = {
      from: "LeaseGenie <onboarding@resend.dev>",
      to: [to],
      subject: `${inviterName} invited you to LeaseGenie`,
      html: `
        <h2>You've been invited to LeaseGenie!</h2>
        <p>${inviterName} has invited you to join their property management system.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="http://localhost:5173/auth?invitation=${invitationId}">Accept Invitation</a>
        <p>This invitation will expire in 7 days.</p>
      `,
    };

    console.log("Sending email with data:", emailData);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const responseText = await res.text();
    console.log("Resend API response:", responseText);

    if (!res.ok) {
      throw new Error(`Failed to send email: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-invitation-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);