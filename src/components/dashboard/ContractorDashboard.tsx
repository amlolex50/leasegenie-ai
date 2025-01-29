import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { Wrench, Calendar, DollarSign } from "lucide-react";
import { ContractorInfoCard } from "./contractor/ContractorInfoCard";
import { WorkOrdersTable } from "./contractor/WorkOrdersTable";

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

      {contractor && <ContractorInfoCard contractor={contractor} />}

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
          {workOrders && <WorkOrdersTable workOrders={workOrders} />}
        </CardContent>
      </Card>
    </div>
  );
};