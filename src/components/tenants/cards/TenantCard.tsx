import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Phone } from "lucide-react";
import { Tenant } from "../types";
import { useNavigate } from "react-router-dom";

interface TenantCardProps {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
}

export const TenantCard = ({ tenant, onEdit }: TenantCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={tenant.id} 
      className="p-6 space-y-4 animate-fade-in cursor-pointer hover:shadow-lg transition-all"
      onClick={() => navigate(`/tenants/${tenant.id}/dashboard`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{tenant.full_name}</h3>
          <p className="text-sm text-muted-foreground">{tenant.email}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(tenant);
          }}
          className="hover:scale-105 transition-transform"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {tenant.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {tenant.location}
          </div>
        )}
        
        {tenant.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {tenant.phone}
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          {tenant.email}
        </div>
      </div>

      <div className="pt-4 border-t">
        <Badge variant="outline">
          Active Lease
        </Badge>
      </div>
    </Card>
  );
};