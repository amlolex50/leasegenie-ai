import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin } from "lucide-react";

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  units: Unit[];
}

interface Unit {
  id: string;
  unit_name: string;
  status: string;
  floor_area: number;
}

export const PropertyOverview = ({ property }: { property: Property }) => {
  const totalUnits = property.units?.length || 0;
  const occupiedUnits = property.units?.filter(u => u.status === 'OCCUPIED').length || 0;
  const occupancyRate = totalUnits ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Building className="w-5 h-5 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold">{property.name}</h3>
                <p className="text-sm text-muted-foreground">Property Name</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 mt-1 text-blue-600" />
              <div>
                <p>{property.address}</p>
                <p>{property.city}, {property.state}</p>
                <p className="text-sm text-muted-foreground">Address</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupied Units</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{occupiedUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{occupancyRate}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};