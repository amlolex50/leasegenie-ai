
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PropertyList } from "@/components/properties/PropertyList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const Properties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties...');
      const { data: userResponse } = await supabase.auth.getUser();
      console.log('Current user:', userResponse?.user);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          name,
          address,
          city,
          state,
          units (
            id,
            unit_name,
            status,
            floor_area
          )
        `);

      console.log('Properties response:', { data, error });

      if (error) {
        console.error('Properties fetch error:', error);
        toast({
          title: "Error",
          description: `Failed to load properties: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      if (!data) {
        console.log('No properties found');
        return [];
      }

      return data;
    },
    retry: 1
  });

  if (error) {
    console.error('Query error:', error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Properties & Units</h1>
            <p className="text-muted-foreground mt-2">Manage your property portfolio</p>
          </div>
          <Button onClick={() => navigate("/properties/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load properties. Please try again later.</p>
          </div>
        ) : (
          <PropertyList properties={properties || []} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Properties;
