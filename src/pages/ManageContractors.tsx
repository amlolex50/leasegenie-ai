import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractorManagement } from "@/components/contractors/ContractorManagement";

const ManageContractors = () => {
  return (
    <DashboardLayout>
      <ContractorManagement />
    </DashboardLayout>
  );
};

export default ManageContractors;