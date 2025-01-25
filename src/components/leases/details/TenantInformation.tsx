import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface TenantInformationProps {
  tenantName: string;
  propertyName: string;
  unitName: string;
}

export const TenantInformation = ({ tenantName, propertyName, unitName }: TenantInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Tenant Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <dt className="text-sm text-muted-foreground">Name</dt>
          <dd className="text-lg font-medium">{tenantName}</dd>
          <dt className="text-sm text-muted-foreground">Property</dt>
          <dd className="text-lg font-medium">{propertyName}</dd>
          <dt className="text-sm text-muted-foreground">Unit</dt>
          <dd className="text-lg font-medium">{unitName}</dd>
        </dl>
      </CardContent>
    </Card>
  );
};