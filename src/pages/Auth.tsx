import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitation");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (invitationId) {
      const fetchInvitation = async () => {
        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('email, status, landlord_id, role, temporary_password')
          .eq('id', invitationId)
          .single();

        if (error || !invitation) {
          toast({
            title: "Error",
            description: "Invalid or expired invitation",
            variant: "destructive",
          });
          return;
        }

        if (invitation.status !== 'PENDING') {
          toast({
            title: "Error",
            description: "This invitation has already been used or has expired",
            variant: "destructive",
          });
          return;
        }

        setEmail(invitation.email);
        
        // Automatically sign up the user with the temporary password
        try {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: invitation.email,
            password: invitation.temporary_password,
          });

          if (signUpError) throw signUpError;

          if (signUpData.user) {
            // Create user profile
            const { error: profileError } = await supabase
              .from('users')
              .insert([
                {
                  id: signUpData.user.id,
                  email: invitation.email,
                  role: invitation.role,
                  landlord_id: invitation.landlord_id,
                  full_name: email.split('@')[0] // Temporary name, user can update later
                }
              ]);

            if (profileError) throw profileError;

            // Update invitation status
            const { error: inviteError } = await supabase
              .from('invitations')
              .update({ status: 'ACCEPTED' })
              .eq('id', invitationId);

            if (inviteError) throw inviteError;

            // Sign in the user
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: invitation.email,
              password: invitation.temporary_password,
            });

            if (signInError) throw signInError;

            toast({
              title: "Welcome!",
              description: "Your account has been created. Please change your password in settings.",
            });

            navigate("/dashboard");
          }
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      };

      fetchInvitation();
    }
  }, [invitationId]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email,
              full_name: fullName,
              role: 'LANDLORD'
            }
          ]);

        if (profileError) throw profileError;

        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // If loading invitation details, show loading state
  if (invitationId && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
            <span className="text-primary text-3xl">★</span>
            LeaseGenie AI
          </CardTitle>
          <CardDescription>
            {invitationId 
              ? "Complete your registration to accept the invitation"
              : "Manage your properties with AI-powered insights"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={invitationId ? "signup" : "signin"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" disabled={!!invitationId}>Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
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
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!!invitationId}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </CardFooter>
      </Card>
    </div>
  );
}