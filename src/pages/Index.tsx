
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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          console.log('No authenticated user found');
          navigate('/auth');
          return;
        }

        console.log('Fetching user role for ID:', session.user.id);
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user data:', userError);
          throw userError;
        }

        if (!userData?.role) {
          console.error('No role found for user');
          toast({
            title: "Error",
            description: "No role assigned. Please contact support.",
            variant: "destructive",
          });
          navigate('/auth');
          return;
        }

        console.log('User role fetched:', userData.role);
        setUserRole(userData.role);
      } catch (error: any) {
        console.error('Error in fetchUserData:', error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast, navigate]);

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
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
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
