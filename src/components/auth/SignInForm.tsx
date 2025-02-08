
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
      console.log('Attempting to sign in with:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data?.user) {
        console.log('Sign in successful:', data.user);
        
        // Query the users table to ensure the profile exists
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email,
                full_name: email.split('@')[0], // Default name from email
                role: 'TENANT' // Default role
              });

            if (insertError) {
              console.error('Profile creation error:', insertError);
              throw new Error('Failed to create user profile');
            }
          } else {
            throw profileError;
          }
        }

        // Successful login, navigate to dashboard
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
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
