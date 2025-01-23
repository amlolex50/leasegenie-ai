import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, Home, Users, Wrench, AlertTriangle, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { InvitationManagement } from "@/components/dashboard/InvitationManagement";

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

const LandlordDashboard = () => {
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
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', revenue: 32000 },
                    { month: 'Feb', revenue: 28000 },
                    { month: 'Mar', revenue: 25000 },
                    { month: 'Apr', revenue: 32000 },
                    { month: 'May', revenue: 35000 },
                    { month: 'Jun', revenue: 30000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Lease Expiring Soon", property: "123 Main St, Unit 101", priority: "HIGH" },
                { title: "Maintenance Due", property: "456 Oak Ave, Unit 202", priority: "MEDIUM" },
                { title: "Rent Payment Overdue", property: "789 Pine St, Unit 303", priority: "HIGH" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.property}</p>
                  </div>
                  <span className={`ml-auto text-xs font-medium ${
                    alert.priority === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Invitation Management</h2>
        <InvitationManagement />
      </div>
    </div>
  );
};

const TenantDashboard = () => {
  const { data: leases } = useQuery({
    queryKey: ['tenant_leases'],
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
        .eq('tenant_id', (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    }
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ['tenant_maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('submitted_by', (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your leases and maintenance requests</p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>My Leases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases?.map((lease: any) => (
                <TableRow key={lease.id}>
                  <TableCell>{lease.units.properties.name}</TableCell>
                  <TableCell>{lease.units.unit_name}</TableCell>
                  <TableCell>${lease.monthly_rent}</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const ContractorDashboard = () => {
  const { data: workOrders } = useQuery({
    queryKey: ['contractor_work_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          maintenance_requests (
            *,
            leases (
              *,
              units (
                *,
                properties (*)
              )
            )
          )
        `)
        .eq('contractor_id', (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your work orders and invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Wrench}
          label="Active Work Orders"
          value={String(workOrders?.filter(wo => wo.status === 'IN_PROGRESS')?.length || "0")}
        />
        <StatCard
          icon={Calendar}
          label="Due Today"
          value={String(workOrders?.filter(wo => 
            wo.estimated_completion === new Date().toISOString().split('T')[0]
          )?.length || "0")}
        />
        <StatCard
          icon={DollarSign}
          label="Pending Invoices"
          value="3"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders?.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {order.maintenance_requests?.leases?.units?.properties?.name} - {order.maintenance_requests?.leases?.units?.unit_name}
                  </TableCell>
                  <TableCell>{order.maintenance_requests?.description}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.estimated_completion}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Update Status</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

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
