import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LandlordDashboard } from "@/components/dashboard/LandlordDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { ContractorDashboard } from "@/components/dashboard/ContractorDashboard";

const Index = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setUserRole(data.role);
        }
      }
    };

    fetchUserRole();
  }, []);

  return (
    <DashboardLayout>
      {userRole === 'LANDLORD' && <LandlordDashboard />}
      {userRole === 'TENANT' && <TenantDashboard />}
      {userRole === 'CONTRACTOR' && <ContractorDashboard />}
      {!userRole && <div>Loading...</div>}
    </DashboardLayout>
  );
};

export default Index;