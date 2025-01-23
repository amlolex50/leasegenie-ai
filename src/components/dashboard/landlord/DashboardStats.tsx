import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "../StatCard";
import { Building, DollarSign, Home, Wrench } from "lucide-react";

export const DashboardStats = () => {
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase.from('units').select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: leases } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leases').select('*, units(*)');
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('maintenance_requests').select('*');
      if (error) throw error;
      return data;
    }
  });

  const stats = [
    {
      icon: Building,
      label: "Total Properties",
      value: String(properties?.length || "0"),
      trend: "+1 this month"
    },
    {
      icon: Home,
      label: "Total Units",
      value: String(units?.length || "0"),
      trend: `${units?.filter(u => u.status === 'OCCUPIED')?.length || 0}/${units?.length || 0} occupied`
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: `$${(leases?.reduce((acc: number, lease: any) => acc + Number(lease.monthly_rent), 0) || 0).toLocaleString()}`,
      trend: "+8% vs last month"
    },
    {
      icon: Wrench,
      label: "Open Maintenance",
      value: String(maintenanceRequests?.filter(mr => mr.status === 'OPEN')?.length || "0"),
      trend: "3 high priority"
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