import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export const PropertyList = ({ properties }: { properties: Property[] }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card 
          key={property.id}
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              {property.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  <p>{property.address}</p>
                  <p>{property.city}, {property.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4" />
                <span>{property.units?.length || 0} Units</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-50 text-green-700 px-2 py-1 rounded">
                  {property.units?.filter(u => u.status === 'OCCUPIED').length || 0} Occupied
                </div>
                <div className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                  {property.units?.filter(u => u.status === 'VACANT').length || 0} Vacant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};