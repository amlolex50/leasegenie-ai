import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface InvitationData {
  email: string;
  temporaryPassword: string;
  role: AppRole;
  landlord_id: string | null;
}

export const useInvitationHandler = (invitationId: string) => {
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleInvitation = async () => {
      try {
        console.log('Starting invitation process for:', invitationId);

        // Sign out any existing session
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          console.error('Error signing out:', signOutError);
        }

        console.log('Fetching invitation details...');
        const { data: invitation, error: inviteError } = await supabase
          .from('invitations')
          .select('email, status, landlord_id, role, temporary_password')
          .eq('id', invitationId)
          .single();

        if (inviteError) {
          console.error('Error fetching invitation:', inviteError);
          throw new Error(inviteError.message || 'Invalid or expired invitation');
        }

        if (!invitation) {
          console.error('No invitation found for ID:', invitationId);
          throw new Error('Invalid or expired invitation');
        }

        console.log('Found invitation details:', { 
          email: invitation.email, 
          role: invitation.role,
          status: invitation.status,
          hasTemporaryPassword: !!invitation.temporary_password
        });

        if (invitation.status !== 'PENDING') {
          console.error('Invalid invitation status:', invitation.status);
          throw new Error('This invitation has already been used or has expired');
        }

        if (!invitation.temporary_password) {
          console.error('Missing temporary password for invitation');
          throw new Error('Invalid invitation: missing temporary password');
        }

        setInvitationData({
          email: invitation.email,
          temporaryPassword: invitation.temporary_password,
          role: invitation.role as AppRole,
          landlord_id: invitation.landlord_id,
        });
        
        console.log('Setting up password change form...');
        setShowPasswordChange(true);
        setLoading(false);

      } catch (error: any) {
        console.error('Error in handleInvitation:', error);
        toast({
          title: "Error Processing Invitation",
          description: error.message || "Failed to process invitation. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    handleInvitation();
  }, [invitationId, toast, navigate]);

  return {
    loading,
    showPasswordChange,
    invitationData,
  };
};