
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Attempting to sign in...");
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!authData.user) {
        throw new Error('No user data returned after sign in');
      }

      // Get or create user profile
      const { error: profileError } = await supabase.rpc(
        'handle_user_profile_upsert',
        {
          user_id: authData.user.id,
          user_email: authData.user.email,
          user_full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
          user_role: authData.user.user_metadata?.role || 'TENANT'
        }
      );

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't throw here, as the user is already authenticated
        toast({
          title: "Profile Update Warning",
          description: "Signed in successfully, but there was an issue updating your profile.",
          variant: "default",
        });
      }

      console.log("Sign in successful, redirecting to dashboard...");
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error('Authentication error:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      
      if (error.message?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to authentication service. Please check your internet connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div className="flex justify-end">
        <a
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Forgot password?
        </a>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};
