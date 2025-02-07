
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePasswordChangeHandler = (invitationId: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePasswordChanged = async () => {
    try {
      setLoading(true);
      console.log('Starting password change completion process');

      // Ensure we have the latest session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('No valid session found');
      }

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

      // Get user data for role-based redirect
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('Error fetching user role:', userError);
        throw userError;
      }

      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      });

      // Redirect based on role
      const role = userData.role.toLowerCase();
      console.log('Redirecting to dashboard for role:', role);
      navigate(`/${role}-dashboard`);

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

  return {
    loading,
    handlePasswordChanged,
  };
};
