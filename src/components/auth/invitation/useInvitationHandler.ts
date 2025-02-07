
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
        await supabase.auth.signOut();

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
          status: invitation.status
        });

        if (invitation.status !== 'PENDING') {
          throw new Error('This invitation has already been used or has expired');
        }

        if (!invitation.temporary_password) {
          throw new Error('Invalid invitation: missing temporary password');
        }

        setInvitationData({
          email: invitation.email,
          temporaryPassword: invitation.temporary_password,
          role: invitation.role as AppRole,
          landlord_id: invitation.landlord_id,
        });
        setShowPasswordChange(true);
        setLoading(false);

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

  return {
    loading,
    showPasswordChange,
    invitationData,
  };
};
