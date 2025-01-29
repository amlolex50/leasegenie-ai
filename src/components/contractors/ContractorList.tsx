import { useState } from "react";
import { ContractorCard } from "./cards/ContractorCard";
import { ContractorUpdateDialog } from "./ContractorUpdateDialog";
import { Contractor } from "./types";

interface ContractorListProps {
  contractors: Contractor[];
}

export const ContractorList = ({ contractors }: ContractorListProps) => {
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const handleEditClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setShowUpdateDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contractors.map((contractor) => (
          <ContractorCard 
            key={contractor.id}
            contractor={contractor}
            onEdit={handleEditClick}
          />
        ))}
      </div>

      {selectedContractor && (
        <ContractorUpdateDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          contractor={selectedContractor}
        />
      )}
    </>
  );
};