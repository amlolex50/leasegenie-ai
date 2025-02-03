import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { OwnerManagement } from "@/components/owners/OwnerManagement";

const ManageOwners = () => {
  return (
    <DashboardLayout>
      <OwnerManagement />
    </DashboardLayout>
  );
};

export default ManageOwners;