import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { Home, Wrench, Calendar } from "lucide-react";
import { TenantHeader } from "./tenant/TenantHeader";
import { PersonalInfoCard } from "./tenant/PersonalInfoCard";
import { LeasesTable } from "./tenant/LeasesTable";

interface TenantDashboardProps {
  tenantId?: string;
}

export const TenantDashboard = ({ tenantId }: TenantDashboardProps) => {
  const { data: tenant } = useQuery({
    queryKey: ['tenant_details', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', tenantId || (await supabase.auth.getUser()).data.user?.id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const { data: leases } = useQuery({
    queryKey: ['tenant_leases', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          units (
            *,
            properties (*)
          )
        `)
        .eq('tenant_id', tenantId || (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ['tenant_maintenance', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('submitted_by', tenantId || (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    }
  });

  if (!tenant) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <TenantHeader fullName={tenant.full_name} />
      
      <PersonalInfoCard 
        email={tenant.email}
        phone={tenant.phone}
        location={tenant.location}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Home}
          label="Active Leases"
          value={String(leases?.length || "0")}
        />
        <StatCard
          icon={Wrench}
          label="Open Requests"
          value={String(maintenanceRequests?.filter(mr => mr.status === 'OPEN')?.length || "0")}
        />
        <StatCard
          icon={Calendar}
          label="Next Payment"
          value="Mar 1, 2024"
        />
      </div>

      <LeasesTable leases={leases || []} />
    </div>
  );
};