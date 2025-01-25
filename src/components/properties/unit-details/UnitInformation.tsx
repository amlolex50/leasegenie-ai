import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";

interface UnitInformationProps {
  unitName: string;
  status: string;
  floorArea: number;
}

export const UnitInformation = ({ unitName, status, floorArea }: UnitInformationProps) => {
  return (
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
          <Badge variant={status === 'OCCUPIED' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Floor Area</span>
          <span>{floorArea} sq ft</span>
        </div>
      </CardContent>
    </Card>
  );
};