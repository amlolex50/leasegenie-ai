import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./StatCard";
import { Home, Wrench, Calendar, User, MapPin, Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TenantDashboardProps {
  tenantId?: string;
}

export const TenantDashboard = ({ tenantId }: TenantDashboardProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Welcome Back, {tenant?.full_name}</h1>
          <p className="text-muted-foreground mt-2">Manage your leases and maintenance requests</p>
        </div>
        <Button variant="outline" className="hover:bg-blue-50">
          <User className="mr-2 h-4 w-4" />
          View Profile
        </Button>
      </div>

      {/* Tenant Information Card */}
      <Card className="bg-white/50 backdrop-blur-sm border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{tenant?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{tenant?.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p>{tenant?.location || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
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

      {/* Leases Card */}
      <Card className="bg-white/50 backdrop-blur-sm border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-blue-900">My Leases</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/leases/create')}>
            <Home className="mr-2 h-4 w-4" />
            View All Leases
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases?.map((lease: any) => (
                  <TableRow key={lease.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{lease.units.properties.name}</TableCell>
                    <TableCell>{lease.units.unit_name}</TableCell>
                    <TableCell>${lease.monthly_rent}</TableCell>
                    <TableCell>
                      {format(new Date(lease.lease_start_date), 'MMM d, yyyy')} - {format(new Date(lease.lease_end_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/leases/${lease.id}`)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};