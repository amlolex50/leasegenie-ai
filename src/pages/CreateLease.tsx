import { LeaseForm } from "@/components/leases/LeaseForm";

export default function CreateLease() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Create New Lease</h1>
      <LeaseForm />
    </div>
  );
}