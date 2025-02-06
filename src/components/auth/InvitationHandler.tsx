
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
        console.log('Starting invitation process for:', invitationId);

        // First, sign out any existing user
        await supabase.auth.signOut();

        // Get invitation details
        const { data: invitation, error: inviteError } = await supabase
          .from('invitations')
          .select('email, status, landlord_id, role, temporary_password')
          .eq('id', invitationId)
          .single();

        if (inviteError || !invitation) {
          console.error('Error fetching invitation:', inviteError);
          throw new Error('Invalid or expired invitation');
        }

        console.log('Found invitation details:', { 
          email: invitation.email, 
          role: invitation.role,
          landlord_id: invitation.landlord_id 
        });

        if (invitation.status !== 'PENDING') {
          throw new Error('This invitation has already been used or has expired');
        }

        // Create the auth account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: invitation.email,
          password: invitation.temporary_password || '',
        });

        if (signUpError) {
          console.error('Error signing up:', signUpError);
          throw signUpError;
        }

        if (!signUpData.user) {
          console.error('No user data returned from signup');
          throw new Error('Failed to create user account');
        }

        console.log('Successfully created auth user:', signUpData.user.id);

        // Wait for auth to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create user profile
        const userProfile = {
          id: signUpData.user.id,
          email: invitation.email,
          role: invitation.role,
          landlord_id: invitation.landlord_id,
          full_name: invitation.email.split('@')[0], // Temporary name
        };

        console.log('Attempting to create user profile:', userProfile);

        const { error: profileError } = await supabase
          .from('users')
          .insert([userProfile]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          console.log('Profile creation attempt details:', userProfile);
          throw new Error(`Failed to create user profile: ${profileError.message}`);
        }

        console.log('Successfully created user profile');

        // Update invitation status
        const { error: inviteUpdateError } = await supabase
          .from('invitations')
          .update({ status: 'ACCEPTED' })
          .eq('id', invitationId);

        if (inviteUpdateError) {
          console.error('Error updating invitation:', inviteUpdateError);
          throw inviteUpdateError;
        }

        console.log('Successfully updated invitation status');

        // Sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: invitation.email,
          password: invitation.temporary_password || '',
        });

        if (signInError) {
          console.error('Error signing in:', signInError);
          throw signInError;
        }

        console.log('Successfully signed in user');

        toast({
          title: "Welcome!",
          description: "Your account has been created. Please change your password in settings.",
        });

        // For owners, navigate to the owner dashboard
        if (invitation.role === 'OWNER') {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
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
