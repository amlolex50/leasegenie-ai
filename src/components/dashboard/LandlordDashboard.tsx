import { DashboardStats } from "./landlord/DashboardStats";
import { DashboardCharts } from "./landlord/DashboardCharts";
import { InvitationSection } from "./invitation/InvitationSection";

export const LandlordDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Landlord Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your property portfolio</p>
      </div>

      <DashboardStats />
      <DashboardCharts />
      <InvitationSection />
    </div>
  );
};