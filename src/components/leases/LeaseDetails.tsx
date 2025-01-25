import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TenantInformation } from "./details/TenantInformation";
import { LeasePeriod } from "./details/LeasePeriod";
import { FinancialDetails } from "./details/FinancialDetails";
import { LeaseDocuments } from "./details/LeaseDocuments";
import { LeaseInsightsSection } from "./details/LeaseInsights";
import { PaymentHistory } from "./details/PaymentHistory";
import { Json } from "@/integrations/supabase/types";

interface LeaseDetailsProps {
  leaseId: string;
}

export interface LeaseInsights {
  leaseDuration: {
    months: number;
    description: string;
  };
  financials: {
    monthlyRent: number;
    totalValue: number;
    description: string;
  };
  property: {
    name: string;
    unit: string;
    description: string;
  };
  tenant: {
    name: string;
    description: string;
  };
}

interface LeaseData {
  id: string;
  unit_id: string;
  tenant_id: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  escalation_rate: number | null;
  deposit_amount: number | null;
  pdf_url: string | null;
  insights: LeaseInsights | null;
  tenant: {
    full_name: string;
  };
  unit: {
    unit_name: string;
    property: {
      name: string;
    };
  };
}

interface RawLeaseData extends Omit<LeaseData, 'insights'> {
  insights: Json;
}

const isValidLeaseInsights = (insights: any): insights is LeaseInsights => {
  return (
    insights &&
    typeof insights === 'object' &&
    'leaseDuration' in insights &&
    'financials' in insights &&
    'property' in insights &&
    'tenant' in insights
  );
};

export const LeaseDetails = ({ leaseId }: LeaseDetailsProps) => {
  const { data: lease, isLoading } = useQuery<LeaseData>({
    queryKey: ['lease', leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          tenant:tenant_id(full_name),
          unit:unit_id(
            unit_name,
            property:property_id(name)
          )
        `)
        .eq('id', leaseId)
        .single();

      if (error) throw error;

      const rawData = data as unknown as RawLeaseData;

      if (!rawData.insights) {
        const { data: insightsData } = await supabase.functions.invoke('generate-lease-insights', {
          body: { leaseId },
        });
        
        if (insightsData?.insights && isValidLeaseInsights(insightsData.insights)) {
          return {
            ...rawData,
            insights: insightsData.insights
          };
        }
      }

      // Validate existing insights before returning
      const validatedInsights = isValidLeaseInsights(rawData.insights) ? rawData.insights : null;

      return {
        ...rawData,
        insights: validatedInsights
      };
    },
  });

  const { data: payments } = useQuery({
    queryKey: ['lease-payments', leaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('lease_id', leaseId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>;
  }

  if (!lease) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TenantInformation
          tenantName={lease.tenant.full_name}
          propertyName={lease.unit.property.name}
          unitName={lease.unit.unit_name}
        />
        
        <LeasePeriod
          startDate={lease.lease_start_date}
          endDate={lease.lease_end_date}
        />
        
        <FinancialDetails
          monthlyRent={lease.monthly_rent}
          depositAmount={lease.deposit_amount}
          escalationRate={lease.escalation_rate}
        />
        
        <LeaseDocuments
          pdfUrl={lease.pdf_url}
          leaseId={lease.id}
        />

        {lease.insights && (
          <LeaseInsightsSection insights={lease.insights} />
        )}
      </div>

      {payments && (
        <PaymentHistory payments={payments} />
      )}
    </div>
  );
};