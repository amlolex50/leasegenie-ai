
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

      // Just verify the profile exists
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Only show warning if it's a permissions error
        if (profileError.code === 'PGRST301') {
          toast({
            title: "Access Error",
            description: "Unable to access your profile. Please contact support.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          return;
        }
      }

      if (!profile) {
        // Create missing profile
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              full_name: authData.user.user_metadata?.full_name || email.split('@')[0],
              role: 'TENANT'
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw new Error('Failed to create user profile');
        }
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
