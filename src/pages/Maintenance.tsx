import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MaintenanceRequestForm } from "@/components/maintenance/forms/MaintenanceRequestForm";
import { MaintenanceRequestList } from "@/components/maintenance/lists/MaintenanceRequestList";

export default function Maintenance() {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Maintenance & Work Orders</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list">Maintenance Requests</TabsTrigger>
            <TabsTrigger value="create">Create Request</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <MaintenanceRequestList />
          </TabsContent>
          
          <TabsContent value="create">
            <MaintenanceRequestForm 
              onSuccess={() => setActiveTab("list")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}