
import { DashboardStats } from "./landlord/DashboardStats";
import { DashboardCharts } from "./landlord/DashboardCharts";
import { InvitationManagement } from "./InvitationManagement";

export const LandlordDashboard = () => {
  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">Landlord Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your property portfolio</p>
      </div>

      <DashboardStats />
      <DashboardCharts />
      <InvitationManagement />
    </div>
  );
};
