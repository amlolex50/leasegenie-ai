import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TenantDashboard as TenantDashboardComponent } from "@/components/dashboard/TenantDashboard";
import { useParams } from "react-router-dom";

const TenantDashboard = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <TenantDashboardComponent tenantId={id!} />
    </DashboardLayout>
  );
};

export default TenantDashboard;