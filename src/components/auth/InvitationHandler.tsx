import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface InvitationHandlerProps {
  invitationId: string;
}

export const InvitationHandler = ({ invitationId }: InvitationHandlerProps) => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('email, status, landlord_id, role, temporary_password')
          .eq('id', invitationId)
          .single();

        if (error || !invitation) {
          toast({
            title: "Error",
            description: "Invalid or expired invitation",
            variant: "destructive",
          });
          return;
        }

        if (invitation.status !== 'PENDING') {
          toast({
            title: "Error",
            description: "This invitation has already been used or has expired",
            variant: "destructive",
          });
          return;
        }

        // Sign up the user with the temporary password
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: invitation.email,
          password: invitation.temporary_password,
        });

        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // If the invited user is an owner, create an owner record first
          let ownerId = null;
          if (invitation.role === 'OWNER') {
            const { data: ownerData, error: ownerError } = await supabase
              .from('owners')
              .insert([
                {
                  full_name: invitation.email.split('@')[0],
                  email: invitation.email,
                }
              ])
              .select()
              .single();

            if (ownerError) throw ownerError;
            ownerId = ownerData.id;
          }

          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: signUpData.user.id,
                email: invitation.email,
                role: invitation.role,
                landlord_id: invitation.landlord_id,
                full_name: invitation.email.split('@')[0],
                owner_id: ownerId
              }
            ]);

          if (profileError) throw profileError;

          // Update invitation status
          const { error: inviteError } = await supabase
            .from('invitations')
            .update({ status: 'ACCEPTED' })
            .eq('id', invitationId);

          if (inviteError) throw inviteError;

          // Sign in the user
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: invitation.email,
            password: invitation.temporary_password,
          });

          if (signInError) throw signInError;

          toast({
            title: "Welcome!",
            description: "Your account has been created. Please change your password in settings.",
          });

          navigate("/dashboard");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleInvitation();
  }, [invitationId, toast, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    );
  }

  return null;
};