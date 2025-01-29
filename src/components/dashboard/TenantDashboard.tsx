import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./StatCard";
import { Home, Wrench, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TenantDashboardProps {
  tenantId?: string;
}

export const TenantDashboard = ({ tenantId }: TenantDashboardProps) => {
  const navigate = useNavigate();

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/leases/${lease.id}`)}
                    >
                      View Details
                    </Button>
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