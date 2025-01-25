import { LeaseDetails } from "@/components/leases/LeaseDetails";
import { useParams } from "react-router-dom";

export default function LeaseDetailsPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Lease Details</h1>
      <LeaseDetails leaseId={id} />
    </div>
  );
}