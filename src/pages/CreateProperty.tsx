import DashboardLayout from "@/components/layout/DashboardLayout";
import { PropertyForm } from "@/components/properties/PropertyForm";

const CreateProperty = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Create Property</h1>
          <p className="text-muted-foreground mt-2">Add a new property to your portfolio</p>
        </div>

        <div className="max-w-2xl">
          <PropertyForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateProperty;