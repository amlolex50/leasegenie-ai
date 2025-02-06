
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandlordDashboard } from "@/components/dashboard/LandlordDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const Index = () => {
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
          toast({
            title: "Error",
            description: "Failed to load user role. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('User role fetched:', data.role); // Debug log
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [toast]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
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
        // Here we no longer default to LandlordDashboard for OWNER
        return <OwnerDashboard />;
      case 'PROPERTY_MANAGER':
        return <PropertyManagerDashboard />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-gray-600">No dashboard available for your role.</p>
            <p className="text-sm text-gray-500">Current role: {userRole || 'None'}</p>
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
