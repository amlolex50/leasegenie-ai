import { Owner } from "./types";
import { OwnerCard } from "./cards/OwnerCard";

interface OwnerListProps {
  owners: Owner[];
}

export const OwnerList = ({ owners }: OwnerListProps) => {
  if (!owners.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No owners found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {owners.map((owner) => (
        <OwnerCard key={owner.id} owner={owner} />
      ))}
    </div>
  );
};