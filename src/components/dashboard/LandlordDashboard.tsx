import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, Home, Users, Wrench, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./StatCard";
import { RevenueChart } from "./RevenueChart";
import { AlertsList } from "./AlertsList";
import { InvitationManagement } from "./InvitationManagement";

export const LandlordDashboard = () => {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your property portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <AlertsList />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Invitation Management</h2>
        <InvitationManagement />
      </div>
    </div>
  );
};