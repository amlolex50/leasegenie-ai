import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceRequests } from "@/components/maintenance/MaintenanceRequests";
import { WorkOrders } from "@/components/maintenance/WorkOrders";
import { CreateMaintenanceRequest } from "@/components/maintenance/CreateMaintenanceRequest";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Maintenance & Work Orders</h1>
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