import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardStats } from "./owner/DashboardStats";
import { DashboardCharts } from "./owner/DashboardCharts";

export const OwnerDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-900">Owner Dashboard</h1>
      <DashboardStats />
      <DashboardCharts />
    </div>
  );
};