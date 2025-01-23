import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "./StatCard";
import { Wrench, Calendar, DollarSign } from "lucide-react";

export const ContractorDashboard = () => {
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