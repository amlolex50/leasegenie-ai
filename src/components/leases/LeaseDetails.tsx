import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TenantInformation } from "./details/TenantInformation";
import { FinancialDetails } from "./details/FinancialDetails";
import { LeasePeriod } from "./details/LeasePeriod";
import { LeaseDocuments } from "./details/LeaseDocuments";
import { LeaseInsightsSection } from "./details/LeaseInsightsSection";
import { LeaseData } from "./types";

const fetchLeaseDetails = async (leaseId: string): Promise<LeaseData> => {
  const { data, error } = await supabase
    .from("leases")
    .select(`
      *,
      tenant:tenant_id (
        full_name,
        email
      ),
      unit:unit_id (
        unit_name,
        property:property_id (
          name
        )
      )
    `)
    .eq("id", leaseId)
    .single();

  if (error) throw error;
  return data as LeaseData;
};

export const LeaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: lease, isLoading, error } = useQuery({
    queryKey: ["lease", id],
    queryFn: () => fetchLeaseDetails(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48 md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load lease details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!lease) {
    return (
      <Alert>
        <AlertDescription>Lease not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Lease Details</h1>
        <p className="text-muted-foreground mt-2">
          {lease.unit.property.name} - Unit {lease.unit.unit_name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TenantInformation
          tenantName={lease.tenant.full_name}
          propertyName={lease.unit.property.name}
          unitName={lease.unit.unit_name}
        />
        <FinancialDetails
          monthlyRent={lease.monthly_rent}
          depositAmount={lease.deposit_amount || 0}
          escalationRate={lease.escalation_rate || 0}
        />
        <LeasePeriod
          startDate={lease.lease_start_date}
          endDate={lease.lease_end_date}
        />
        {lease.insights && <LeaseInsightsSection insights={lease.insights} />}
        <LeaseDocuments pdfUrl={lease.pdf_url} leaseId={lease.id} />
      </div>
    </div>
  );
};