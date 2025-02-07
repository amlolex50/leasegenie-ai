
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
        .select('id, name');
      
      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load properties data",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    }
  });

  const { data: units, isLoading: unitsLoading } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('id, status, property_id');
      
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
    }
  });

  const { data: leases, isLoading: leasesLoading } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leases')
        .select('id, monthly_rent, unit_id');
      
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
    }
  });

  const { data: maintenanceRequests, isLoading: maintenanceLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('id, status, priority, lease_id');
      
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
    }
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

  // Filter units belonging to the owner's properties
  const propertyIds = properties?.map(p => p.id) || [];
  const filteredUnits = units?.filter(u => propertyIds.includes(u.property_id)) || [];
  
  // Filter leases for the owner's units
  const unitIds = filteredUnits?.map(u => u.id) || [];
  const filteredLeases = leases?.filter(l => unitIds.includes(l.unit_id)) || [];
  
  // Filter maintenance requests for the owner's leases
  const leaseIds = filteredLeases?.map(l => l.id) || [];
  const filteredMaintenance = maintenanceRequests?.filter(mr => leaseIds.includes(mr.lease_id)) || [];

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
      value: String(filteredUnits?.length || "0"),
      trend: `${filteredUnits?.filter(u => u.status === 'OCCUPIED')?.length || 0}/${filteredUnits?.length || 0} occupied`
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: `$${(filteredLeases?.reduce((acc, lease) => acc + Number(lease.monthly_rent), 0) || 0).toLocaleString()}`,
      trend: "+8% vs last month"
    },
    {
      icon: Wrench,
      label: "Open Maintenance",
      value: String(filteredMaintenance?.filter(mr => mr.status === 'OPEN')?.length || "0"),
      trend: `${filteredMaintenance?.filter(mr => mr.priority === 'HIGH' && mr.status === 'OPEN')?.length || 0} high priority`
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
