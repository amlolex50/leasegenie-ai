import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./StatCard";
import { Wrench, Calendar, DollarSign, Mail, MapPin } from "lucide-react";

interface ContractorDashboardProps {
  contractorId?: string;
}

export const ContractorDashboard = ({ contractorId }: ContractorDashboardProps) => {
  const { data: workOrders } = useQuery({
    queryKey: ['contractor_work_orders', contractorId],
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
        .eq('contractor_id', contractorId || (await supabase.auth.getUser()).data.user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!contractorId
  });

  const { data: contractor } = useQuery({
    queryKey: ['contractor_details', contractorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', contractorId || (await supabase.auth.getUser()).data.user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!contractorId
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your work orders and invoices</p>
      </div>

      {contractor && (
        <Card>
          <CardHeader>
            <CardTitle>Contractor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{contractor.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{contractor.location || 'Location not specified'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span>{contractor.speciality || 'Speciality not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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