import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type InvitationRole = 'TENANT' | 'CONTRACTOR' | 'OWNER';

export const InvitationForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InvitationRole>("TENANT");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get the current user's session
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      if (!user) {
        console.error('No user found');
        toast({
          title: "Error",
          description: "You must be logged in to send invitations",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      console.log('Current user:', user); // Debug log

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
            temporary_password: temporaryPassword,
            status: 'PENDING'
          }
        ])
        .select()
        .single();

      if (inviteError) {
        console.error('Invitation creation error:', inviteError);
        throw inviteError;
      }

      if (!invitation) {
        throw new Error('No invitation was created');
      }

      console.log('Created invitation:', invitation);

      // Prepare email data
      const emailData = {
        to: email,
        invitationId: invitation.id,
        inviterId: user.id, // Explicitly set the inviterId
        temporaryPassword,
        role
      };

      console.log('Sending email with data:', emailData);

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-invitation-email', {
        body: JSON.stringify(emailData),
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
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