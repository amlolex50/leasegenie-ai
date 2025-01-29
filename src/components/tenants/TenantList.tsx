import { useState } from "react";
import { TenantCard } from "./cards/TenantCard";
import { TenantUpdateDialog } from "./TenantUpdateDialog";
import { Tenant } from "./types";

interface TenantListProps {
  tenants: Tenant[];
}

export const TenantList = ({ tenants }: TenantListProps) => {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const handleEditClick = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowUpdateDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <TenantCard 
            key={tenant.id}
            tenant={tenant}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {selectedTenant && (
        <TenantUpdateDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          tenant={selectedTenant}
        />
      )}
    </>
  );
};