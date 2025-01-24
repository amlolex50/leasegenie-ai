import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UnitForm } from "@/components/properties/UnitForm";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const EditUnit = () => {
  const { id: propertyId, unitId } = useParams();
  const { toast } = useToast();

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', unitId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load unit details",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (!propertyId || !unitId) {
    return null;
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Edit Unit</h1>
          <p className="text-muted-foreground mt-2">Update unit details</p>
        </div>
        <UnitForm propertyId={propertyId} unit={unit} />
      </div>
    </DashboardLayout>
  );
};

export default EditUnit;