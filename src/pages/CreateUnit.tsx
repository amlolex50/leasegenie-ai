import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UnitForm } from "@/components/properties/UnitForm";
import { useParams } from "react-router-dom";

const CreateUnit = () => {
  const { id: propertyId } = useParams();

  if (!propertyId) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Add New Unit</h1>
          <p className="text-muted-foreground mt-2">Create a new unit for your property</p>
        </div>
        <UnitForm propertyId={propertyId} />
      </div>
    </DashboardLayout>
  );
};

export default CreateUnit;