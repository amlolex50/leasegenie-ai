import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, MapPin } from "lucide-react";
import { UnitImageGallery } from "@/components/properties/UnitImageGallery";
import { Badge } from "@/components/ui/badge";
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Unit Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={unit.status === 'OCCUPIED' ? 'default' : 'secondary'}>
                  {unit.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Floor Area</span>
                <span>{unit.floor_area} sq ft</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <div>
                  <p>{unit.property.address}</p>
                  <p>{unit.property.city}, {unit.property.state}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <UnitImageGallery unitId={unit.id} images={unit.unit_images} />
      </div>
    </DashboardLayout>
  );
};

export default UnitDetails;