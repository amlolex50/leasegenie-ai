import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type InvitationRole = 'TENANT' | 'CONTRACTOR' | 'OWNER';

export const InvitationForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>("TENANT");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateTemporaryPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  const sendInvitationEmail = async (invitationId: string, email: string, inviterName: string, temporaryPassword: string) => {
    const { data, error } = await supabase.functions.invoke('send-invitation-email', {
      body: { to: email, invitationId, inviterName, temporaryPassword },
    });

    if (error) throw error;
    return data;
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get user's full name
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const temporaryPassword = generateTemporaryPassword();

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('invitations')
        .insert([
          {
            email,
            role,
            invited_by: user.id,
            landlord_id: user.id,
            temporary_password: temporaryPassword
          }
        ])
        .select()
        .single();

      if (inviteError) throw inviteError;

      // Send email
      try {
        await sendInvitationEmail(invitation.id, email, userData.full_name, temporaryPassword);
      } catch (emailError) {
        console.error('Error sending invitation email:', emailError);
        throw emailError;
      }

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      setEmail("");
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div className="flex gap-4">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Select
          value={role}
          onValueChange={(value) => setRole(value as InvitationRole)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TENANT">Tenant</SelectItem>
            <SelectItem value="CONTRACTOR">Contractor</SelectItem>
            <SelectItem value="OWNER">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Invitation
          </>
        )}
      </Button>
    </form>
  );
};