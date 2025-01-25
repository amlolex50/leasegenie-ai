import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin } from "lucide-react";

interface PropertyInformationProps {
  name: string;
  address: string;
  city: string;
  state: string;
}

export const PropertyInformation = ({ name, address, city, state }: PropertyInformationProps) => {
  return (
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
            <p>{address}</p>
            <p>{city}, {state}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};