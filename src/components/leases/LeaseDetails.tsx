import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, DollarSign, Calendar, User, Building } from "lucide-react";

interface LeaseDetailsProps {
  leaseId: string;
}

export interface LeaseInsights {
  leaseDuration: {
    startDate: string;
    endDate: string;
    totalMonths: number;
    description: string;
  };
  financials: {
    monthlyRent: number;
    depositAmount: number;
    escalationRate?: number;
    description: string;
  };
  property: {
    description: string;
    keyFeatures: string[];
  };
  tenant: {
    responsibilities: string[];
    restrictions: string[];
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
  deposit_amount: number;
  escalation_rate: number | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  insights: LeaseInsights | null;
  unit: {
    unit_name: string;
    property: {
      name: string;
      address: string;
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
    'tenant' in insights &&
    typeof insights.leaseDuration === 'object' &&
    typeof insights.financials === 'object' &&
    typeof insights.property === 'object' &&
    typeof insights.tenant === 'object'
  );
};

export const LeaseDetails = ({ leaseId }: LeaseDetailsProps) => {
  const { data: lease, isLoading, error } = useQuery({
    queryKey: ['lease', leaseId],
    queryFn: async (): Promise<LeaseData> => {
      const { data: rawData, error } = await supabase
        .from('leases')
        .select(`
          *,
          unit:units(
            unit_name,
            property:properties(
              name,
              address
            )
          )
        `)
        .eq('id', leaseId)
        .single();

      if (error) throw error;
      if (!rawData) throw new Error('Lease not found');

      const typedRawData = rawData as unknown as RawLeaseData;

      // If no insights exist, generate them
      if (!typedRawData.insights) {
        const { data: insightsData, error: insightsError } = await supabase
          .functions.invoke('generate-lease-insights', {
            body: { leaseId },
          });

        if (insightsError) {
          console.error('Error generating insights:', insightsError);
          return { ...typedRawData, insights: null };
        }

        if (insightsData?.insights && isValidLeaseInsights(insightsData.insights)) {
          return {
            ...typedRawData,
            insights: insightsData.insights,
          };
        }
      }

      // Validate existing insights
      return {
        ...typedRawData,
        insights: isValidLeaseInsights(typedRawData.insights) ? typedRawData.insights : null,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading lease details: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!lease) {
    return (
      <Alert>
        <AlertDescription>No lease details found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Lease Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Property Details
              </h3>
              <p className="text-gray-600">{lease.unit.property.name}</p>
              <p className="text-gray-600">{lease.unit.property.address}</p>
              <p className="text-gray-600">Unit: {lease.unit.unit_name}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Lease Period
              </h3>
              <p className="text-gray-600">
                From: {new Date(lease.lease_start_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                To: {new Date(lease.lease_end_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {lease.insights ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Monthly Rent</p>
                  <p className="text-gray-600">
                    ${lease.insights.financials.monthlyRent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Security Deposit</p>
                  <p className="text-gray-600">
                    ${lease.insights.financials.depositAmount.toLocaleString()}
                  </p>
                </div>
                {lease.insights.financials.escalationRate && (
                  <div>
                    <p className="font-medium">Annual Rent Increase</p>
                    <p className="text-gray-600">
                      {lease.insights.financials.escalationRate}%
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Tenant Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lease.insights.tenant.responsibilities.map((resp, index) => (
                      <li key={index} className="text-gray-600">{resp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Restrictions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lease.insights.tenant.restrictions.map((restriction, index) => (
                      <li key={index} className="text-gray-600">{restriction}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert>
          <AlertDescription>
            AI-generated insights are not available for this lease yet. They will be generated automatically.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
