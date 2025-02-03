import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandlordDashboard } from "@/components/dashboard/LandlordDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
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
          console.log('User role fetched:', data.role);
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

  return (
    <DashboardLayout>
      {userRole === 'LANDLORD' && <LandlordDashboard />}
      {userRole === 'TENANT' && <TenantDashboard />}
      {userRole === 'CONTRACTOR' && <ContractorDashboard />}
      {userRole === 'OWNER' && <OwnerDashboard />}
      {!userRole && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600">No dashboard available for your role.</p>
          <p className="text-sm text-gray-500">Current role: {userRole || 'None'}</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;