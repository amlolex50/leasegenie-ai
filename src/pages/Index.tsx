
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandlordDashboard } from "@/components/dashboard/LandlordDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { PropertyManagerDashboard } from "@/components/dashboard/PropertyManagerDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type AppRole = Database["public"]["Enums"]["app_role"];

const Index = () => {
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        if (!session?.user) {
          console.log('No active session found');
          navigate('/auth');
          return;
        }

        // Add debugging logs
        console.log('Current auth user ID:', session.user.id);
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError);
          toast({
            title: "Error Loading Profile",
            description: "Unable to load your profile. Please try signing in again.",
            variant: "destructive",
          });
          // Sign out the user if we can't load their profile
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }

        // Add debugging log for user data
        console.log('Fetched user data:', userData);

        if (!userData?.role) {
          console.error('No role found for user');
          toast({
            title: "Account Setup Required",
            description: "Please contact support to complete your account setup",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        setUserRole(userData.role);
      } catch (error: any) {
        console.error('Error in fetchUserData:', error);
        toast({
          title: "Error Loading Dashboard",
          description: "We're experiencing technical difficulties. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUserRole(null);
        navigate('/auth');
      } else if (event === 'SIGNED_IN' && session) {
        await fetchUserData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!userRole) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600">Unable to load your dashboard. Please try signing in again.</p>
        </div>
      </DashboardLayout>
    );
  }

  const getDashboardComponent = () => {
    switch (userRole) {
      case 'LANDLORD':
        return <LandlordDashboard />;
      case 'TENANT':
        return <TenantDashboard />;
      case 'CONTRACTOR':
        return <ContractorDashboard />;
      case 'OWNER':
        return <OwnerDashboard />;
      case 'PROPERTY_MANAGER':
        return <PropertyManagerDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-gray-600">No dashboard available for your role.</p>
            <p className="text-sm text-gray-500">Current role: {userRole}</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  );
};

export default Index;
