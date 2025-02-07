
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

      // Refresh the session to get the latest user data
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        throw refreshError;
      }

      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user after refresh:', user);

      if (!user) {
        throw new Error('No authenticated user found after password change');
      }

      // Get user role to determine dashboard redirect
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
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
