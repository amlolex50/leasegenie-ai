import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, Home, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </CardContent>
  </Card>
);

const TopTenantsList = ({ tenants }: { tenants: any[] }) => (
  <div className="space-y-4">
    {tenants.map((tenant, i) => (
      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">{tenant.name}</p>
          <p className="text-xs text-muted-foreground">Unit {tenant.unit}</p>
        </div>
        <div className="ml-auto text-sm font-medium">${tenant.rent}/mo</div>
      </div>
    ))}
  </div>
);

const Index = () => {
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: units } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: leases } = useQuery({
    queryKey: ['leases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leases')
        .select('*, units(*)');
      if (error) throw error;
      return data;
    }
  });

  const monthlyData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 25000 },
    { month: 'Apr', revenue: 32000 },
    { month: 'May', revenue: 35000 },
    { month: 'Jun', revenue: 30000 },
    { month: 'Jul', revenue: 34000 },
    { month: 'Aug', revenue: 26000 },
    { month: 'Sep', revenue: 32000 },
    { month: 'Oct', revenue: 26000 },
    { month: 'Nov', revenue: 34000 },
    { month: 'Dec', revenue: 36000 },
  ];

  const mockTenants = [
    { name: "John Smith", unit: "101", rent: 2500 },
    { name: "Sarah Johnson", unit: "205", rent: 3000 },
    { name: "Michael Brown", unit: "304", rent: 2800 },
  ];

  const stats = [
    {
      icon: Building,
      label: "Total Properties",
      value: properties?.length || "0",
      trend: "+1 this month"
    },
    {
      icon: Home,
      label: "Total Units",
      value: units?.length || "0",
      trend: "80% occupied"
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: `$${leases?.reduce((acc: number, lease: any) => acc + Number(lease.monthly_rent), 0).toLocaleString() || "0"}`,
      trend: "+8% vs last month"
    },
    {
      icon: Users,
      label: "Active Tenants",
      value: leases?.length || "0",
      trend: "+2 this month"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">Welcome to your property management dashboard.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Revenue
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    ${payload[0].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <TopTenantsList tenants={mockTenants} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;