import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TenantManagement } from "@/components/tenants/TenantManagement";

const ManageTenants = () => {
  return (
    <DashboardLayout>
      <TenantManagement />
    </DashboardLayout>
  );
};

export default ManageTenants;