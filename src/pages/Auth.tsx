
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { InvitationHandler } from "@/components/auth/InvitationHandler";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get("invitation");

  if (invitationId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <InvitationHandler invitationId={invitationId} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="container max-w-[400px] mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <span className="text-primary text-3xl">★</span>
              LeaseGenie AI
            </CardTitle>
            <CardDescription>
              Manage your properties with AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <SignInForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
