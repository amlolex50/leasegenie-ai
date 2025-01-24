import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Property {
  id: string;
}

export const PropertyMaintenance = ({ property }: { property: Property }) => {
  const { toast } = useToast();

  const { data: maintenanceRequests, isLoading } = useQuery({
    queryKey: ['maintenance-requests', property.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          lease:leases (
            unit:units (
              id,
              unit_name,
              property_id
            )
          )
        `)
        .eq('lease.unit.property_id', property.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load maintenance requests",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceRequests?.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{request.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Unit: {request.lease.unit.unit_name}
                  </p>
                </div>
                <Badge variant={request.status === 'OPEN' ? 'destructive' : 'default'}>
                  {request.status}
                </Badge>
              </div>
            ))}
            {(!maintenanceRequests || maintenanceRequests.length === 0) && (
              <p className="text-center text-muted-foreground">No maintenance requests found</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};