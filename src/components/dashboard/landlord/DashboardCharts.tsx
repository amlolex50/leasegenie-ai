import { RevenueChart } from "../RevenueChart";
import { AlertsList } from "../AlertsList";

export const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <RevenueChart />
      <AlertsList />
    </div>
  );
};