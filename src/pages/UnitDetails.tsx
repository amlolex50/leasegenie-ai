import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { UnitInformation } from "@/components/properties/unit-details/UnitInformation";
import { PropertyInformation } from "@/components/properties/unit-details/PropertyInformation";
import { UnitImageGallery } from "@/components/properties/UnitImageGallery";
import { useToast } from "@/components/ui/use-toast";

const UnitDetails = () => {
  const { id, unitId } = useParams();
  const { toast } = useToast();

  const { data: unit, isLoading } = useQuery({
    queryKey: ['unit', unitId],
    queryFn: async () => {
      const { data: unitData, error: unitError } = await supabase
        .from('units')
        .select(`
          *,
          property:properties(name, address, city, state),
          unit_images(*)
        `)
        .eq('id', unitId)
        .single();

      if (unitError) {
        toast({
          title: "Error",
          description: "Failed to load unit details",
          variant: "destructive",
        });
        throw unitError;
      }

      if (unitData && unitData.unit_images) {
        const imagesWithUrls = await Promise.all(
          unitData.unit_images.map(async (image) => {
            const { data: publicUrl } = supabase.storage
              .from('unit_images')
              .getPublicUrl(image.image_url);
            
            return {
              ...image,
              image_url: publicUrl.publicUrl
            };
          })
        );
        unitData.unit_images = imagesWithUrls;
      }

      return unitData;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!unit) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Unit not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Unit {unit.unit_name}</h1>
          <p className="text-muted-foreground mt-2">
            {unit.property.name} - {unit.property.address}, {unit.property.city}, {unit.property.state}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UnitInformation
            unitName={unit.unit_name}
            status={unit.status}
            floorArea={unit.floor_area}
          />
          <PropertyInformation
            name={unit.property.name}
            address={unit.property.address}
            city={unit.property.city}
            state={unit.property.state}
          />
        </div>

        <UnitImageGallery unitId={unit.id} images={unit.unit_images || []} />
      </div>
    </DashboardLayout>
  );
};

export default UnitDetails;