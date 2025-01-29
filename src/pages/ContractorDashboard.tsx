import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractorDashboard as ContractorDashboardComponent } from "@/components/dashboard/ContractorDashboard";

const ContractorDashboard = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <ContractorDashboardComponent contractorId={id} />
    </DashboardLayout>
  );
};

export default ContractorDashboard;