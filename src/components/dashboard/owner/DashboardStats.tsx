import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "../StatCard";
import { Building2, DollarSign, Home, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardStats = () => {
  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['owner-properties'],
    queryFn: async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('owner_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userData?.owner_id) return [];

      const { data, error } = await supabase
        .from('properties')
        .select('*, units(*)')
        .eq('owner_reference_id', userData.owner_id);

      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceRequests, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['owner-maintenance'],
    queryFn: async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('owner_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userData?.owner_id) return [];

      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          lease:leases (
            unit:units (
              property:properties (
                owner_reference_id
              )
            )
          )
        `)
        .eq('lease.unit.property.owner_reference_id', userData.owner_id);

      if (error) throw error;
      return data;
    }
  });

  const isLoading = propertiesLoading || maintenanceLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  const totalUnits = properties?.reduce((acc, prop) => acc + (prop.units?.length || 0), 0) || 0;
  const occupiedUnits = properties?.reduce((acc, prop) => 
    acc + (prop.units?.filter(u => u.status === 'OCCUPIED')?.length || 0), 0) || 0;

  const stats = [
    {
      icon: Building2,
      label: "My Properties",
      value: String(properties?.length || "0"),
      trend: "Total properties owned"
    },
    {
      icon: Home,
      label: "Total Units",
      value: String(totalUnits),
      trend: `${occupiedUnits}/${totalUnits} occupied`
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: `$${properties?.reduce((acc, prop) => 
        acc + (prop.units?.reduce((unitAcc, unit) => 
          unitAcc + (unit.status === 'OCCUPIED' ? 1000 : 0), 0) || 0), 0).toLocaleString()}`,
      trend: "Estimated monthly"
    },
    {
      icon: Wrench,
      label: "Maintenance Issues",
      value: String(maintenanceRequests?.filter(mr => mr.status === 'OPEN')?.length || "0"),
      trend: "Open requests"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};