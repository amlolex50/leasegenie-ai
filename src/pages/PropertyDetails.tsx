import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, ClipboardList, DollarSign, Wrench } from "lucide-react";
import { PropertyOverview } from "@/components/properties/PropertyOverview";
import { PropertyUnits } from "@/components/properties/PropertyUnits";
import { PropertyFinancials } from "@/components/properties/PropertyFinancials";
import { PropertyMaintenance } from "@/components/properties/PropertyMaintenance";
import { useToast } from "@/components/ui/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          units (
            id,
            unit_name,
            status,
            floor_area
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        throw error;
      }

      return data;
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

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Property not found</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{property.name}</h1>
          <p className="text-muted-foreground mt-2">{property.address}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="units" className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Units
            </TabsTrigger>
            <TabsTrigger value="financials" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PropertyOverview property={property} />
          </TabsContent>

          <TabsContent value="units">
            <PropertyUnits property={property} />
          </TabsContent>

          <TabsContent value="financials">
            <PropertyFinancials property={property} />
          </TabsContent>

          <TabsContent value="maintenance">
            <PropertyMaintenance property={property} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PropertyDetails;