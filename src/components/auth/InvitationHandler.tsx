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
        console.log('Processing invitation:', invitationId);

        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('email, status, landlord_id, role, temporary_password')
          .eq('id', invitationId)
          .single();

        if (error || !invitation) {
          console.error('Error fetching invitation:', error);
          toast({
            title: "Error",
            description: "Invalid or expired invitation",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        console.log('Found invitation:', invitation);

        if (invitation.status !== 'PENDING') {
          toast({
            title: "Error",
            description: "This invitation has already been used or has expired",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        // First try to sign in in case the user already exists
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: invitation.email,
          password: invitation.temporary_password,
        });

        if (signInError?.message.includes('Invalid login credentials')) {
          console.log('User does not exist, creating new account');
          // If sign in fails, create the account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: invitation.email,
            password: invitation.temporary_password,
          });

          if (signUpError) {
            console.error('Error signing up:', signUpError);
            throw signUpError;
          }

          if (!signUpData.user) {
            throw new Error('No user data returned from signup');
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
                full_name: invitation.email.split('@')[0] // Temporary name
              }
            ]);

          if (profileError) {
            console.error('Error creating profile:', profileError);
            throw profileError;
          }

          // Update invitation status
          const { error: inviteError } = await supabase
            .from('invitations')
            .update({ status: 'ACCEPTED' })
            .eq('id', invitationId);

          if (inviteError) {
            console.error('Error updating invitation:', inviteError);
            throw inviteError;
          }

          // Sign in the user
          const { error: finalSignInError } = await supabase.auth.signInWithPassword({
            email: invitation.email,
            password: invitation.temporary_password,
          });

          if (finalSignInError) {
            console.error('Error signing in:', finalSignInError);
            throw finalSignInError;
          }
        } else if (signInError) {
          // If there was a different error during sign in
          console.error('Error signing in:', signInError);
          throw signInError;
        }

        toast({
          title: "Welcome!",
          description: "Your account has been created. Please change your password in settings.",
        });

        navigate("/dashboard");
      } catch (error: any) {
        console.error('Error in handleInvitation:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate('/auth');
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