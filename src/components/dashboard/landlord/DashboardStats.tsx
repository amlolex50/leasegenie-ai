
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "../StatCard";
import { Building, DollarSign, Home, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export const DashboardStats = () => {
  const { toast } = useToast();

  const { data: properties, isLoading: propertiesLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id');
      
      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties data",
          variant: "destructive",
        });
        throw error; // Let React Query handle the retry
      }
      return data || [];
    }
  });

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('id, status');
      
      if (error) {
        console.error('Error fetching units:', error);
        toast({
          title: "Error",
          description: "Failed to load units data",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    enabled: !propertiesLoading && !!properties?.length
  });

  const { data: leases, isLoading: leasesLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leases')
        .select('id, monthly_rent');
      
      if (error) {
        console.error('Error fetching leases:', error);
        toast({
          title: "Error",
          description: "Failed to load leases data",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    enabled: !unitsLoading && !!units?.length
  });

  const { data: maintenanceRequests, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('id, status, priority');
      
      if (error) {
        console.error('Error fetching maintenance requests:', error);
        toast({
          title: "Error",
          description: "Failed to load maintenance data",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    },
    enabled: !leasesLoading && !!leases?.length
  });

  const isLoading = propertiesLoading || unitsLoading || leasesLoading || maintenanceLoading;

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
      value: `$${(leases?.reduce((acc, lease) => acc + Number(lease.monthly_rent), 0) || 0).toLocaleString()}`,
      trend: "+8% vs last month"
    },
    {
      icon: Wrench,
      label: "Open Maintenance",
      value: String(maintenanceRequests?.filter(mr => mr.status === 'OPEN')?.length || "0"),
      trend: `${maintenanceRequests?.filter(mr => mr.priority === 'HIGH' && mr.status === 'OPEN')?.length || 0} high priority`
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
