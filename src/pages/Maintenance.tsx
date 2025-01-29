import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequests } from "@/components/maintenance/MaintenanceRequests";
import { WorkOrders } from "@/components/maintenance/WorkOrders";
import { CreateMaintenanceRequest } from "@/components/maintenance/CreateMaintenanceRequest";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Wrench } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("requests");

  const { data: userRole } = useQuery({
    queryKey: ['user_role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      return data?.role;
    }
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Maintenance & Work Orders</h1>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Wrench className="mr-2 h-4 w-4" />
                  Create Maintenance Request
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Maintenance Request</DialogTitle>
                </DialogHeader>
                <CreateMaintenanceRequest />
              </DialogContent>
            </Dialog>

            {userRole === 'CONTRACTOR' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Work Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Work Order</DialogTitle>
                  </DialogHeader>
                  {/* We'll implement CreateWorkOrder component later */}
                  <div className="p-4">
                    <p>Work order creation form will be implemented here.</p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
            <TabsTrigger value="workorders">Work Orders</TabsTrigger>
            <TabsTrigger value="create">Create Request</TabsTrigger>
          </TabsList>
          <TabsContent value="requests">
            <MaintenanceRequests />
          </TabsContent>
          <TabsContent value="workorders">
            <WorkOrders />
          </TabsContent>
          <TabsContent value="create">
            <CreateMaintenanceRequest />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}