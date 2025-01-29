import DashboardLayout from "@/components/layout/DashboardLayout";
import { LeaseList } from "@/components/leases/LeaseList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Leases = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Lease Management</h1>
            <p className="text-muted-foreground">Manage your property leases and agreements</p>
          </div>
          <Button onClick={() => navigate("/leases/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Lease
          </Button>
        </div>
        <LeaseList />
      </div>
    </DashboardLayout>
  );
};

export default Leases;