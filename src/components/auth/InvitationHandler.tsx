
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { ChangeTemporaryPassword } from "./ChangeTemporaryPassword";

type AppRole = Database["public"]["Enums"]["app_role"];

interface InvitationHandlerProps {
  invitationId: string;
}

export const InvitationHandler = ({ invitationId }: InvitationHandlerProps) => {
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [invitationData, setInvitationData] = useState<{
    email: string;
    temporaryPassword: string;
    role: AppRole;
    landlord_id: string | null;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
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

        if (!invitation.temporary_password) {
          throw new Error('Invalid invitation: missing temporary password');
        }

        // Sign in with temporary password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: invitation.email,
          password: invitation.temporary_password,
        });

        if (signInError) {
          console.error('Error signing in:', signInError);
          throw signInError;
        }

        if (!signInData.user) {
          throw new Error('Failed to sign in with temporary password');
        }

        console.log('Successfully signed in with temporary password');

        // Create user profile
        const userProfile = {
          id: signInData.user.id,
          email: invitation.email,
          role: invitation.role as AppRole,
          landlord_id: invitation.landlord_id,
          full_name: invitation.email.split('@')[0], // Temporary name
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert(userProfile);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error(`Failed to create user profile: ${profileError.message}`);
        }

        console.log('Successfully created user profile');

        // Store the data needed for password change
        setInvitationData({
          email: invitation.email,
          temporaryPassword: invitation.temporary_password,
          role: invitation.role as AppRole,
          landlord_id: invitation.landlord_id,
        });
        setUserId(signInData.user.id);
        setShowPasswordChange(true);

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

  const handlePasswordChanged = async () => {
    if (!invitationData || !userId) return;

    try {
      setLoading(true);

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

      // Refresh the session to ensure new role is picked up
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        throw refreshError;
      }

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error in handlePasswordChanged:', error);
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

  if (loading && !showPasswordChange) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-gray-600">Setting up your account...</p>
      </div>
    );
  }

  if (showPasswordChange && invitationData) {
    return (
      <ChangeTemporaryPassword
        email={invitationData.email}
        temporaryPassword={invitationData.temporaryPassword}
        onPasswordChanged={handlePasswordChanged}
      />
    );
  }

  return null;
};
