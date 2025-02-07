
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ChangeTemporaryPasswordProps {
  email: string;
  temporaryPassword: string;
  onPasswordChanged: () => void;
}

export const ChangeTemporaryPassword = ({
  email,
  temporaryPassword,
  onPasswordChanged,
}: ChangeTemporaryPasswordProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting password change process for:', email);
      
      // First sign in with temporary password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: temporaryPassword,
      });

      if (signInError || !signInData.session) {
        console.error('Error signing in:', signInError);
        throw signInError || new Error('Failed to sign in');
      }

      console.log('Successfully signed in with temporary password');

      // Then update to new password
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError || !updateData.user) {
        console.error('Error updating password:', updateError);
        throw updateError || new Error('Failed to update password');
      }

      console.log('Password successfully updated');

      // Ensure we have a valid session after password change
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to verify session after password change');
      }

      console.log('Session verified after password change');

      toast({
        title: "Success",
        description: "Password successfully changed",
      });

      // Call the callback to handle redirection
      onPasswordChanged();
    } catch (error: any) {
      console.error('Error in password change:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-center">Set Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              className="transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="transition-all duration-200"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full transition-all duration-200" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Password...
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
