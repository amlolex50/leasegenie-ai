import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, FileText, User, LineChart } from "lucide-react";
import { format } from "date-fns";

interface LeaseDetailsProps {
  leaseId: string;
}

interface LeaseInsights {
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

      // Generate insights if they don't exist
      if (!data.insights) {
        const { data: insightsData } = await supabase.functions.invoke('generate-lease-insights', {
          body: { leaseId },
        });
        if (insightsData?.insights) {
          data.insights = insightsData.insights as LeaseInsights;
        }
      } else {
        // Cast existing insights to LeaseInsights type
        data.insights = data.insights as LeaseInsights;
      }

      return data as LeaseData;
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

  const downloadLease = async () => {
    if (!lease.pdf_url) return;
    
    const { data, error } = await supabase.storage
      .from('lease_documents')
      .download(lease.pdf_url);

    if (error) {
      console.error('Error downloading lease:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease-${lease.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <dd className="text-lg font-medium">{lease.tenant.full_name}</dd>
              <dt className="text-sm text-muted-foreground">Property</dt>
              <dd className="text-lg font-medium">{lease.unit.property.name}</dd>
              <dt className="text-sm text-muted-foreground">Unit</dt>
              <dd className="text-lg font-medium">{lease.unit.unit_name}</dd>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lease Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="text-sm text-muted-foreground">Start Date</dt>
              <dd className="text-lg font-medium">
                {format(new Date(lease.lease_start_date), 'PPP')}
              </dd>
              <dt className="text-sm text-muted-foreground">End Date</dt>
              <dd className="text-lg font-medium">
                {format(new Date(lease.lease_end_date), 'PPP')}
              </dd>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <dt className="text-sm text-muted-foreground">Monthly Rent</dt>
              <dd className="text-lg font-medium">
                ${lease.monthly_rent.toLocaleString()}
              </dd>
              {lease.deposit_amount && (
                <>
                  <dt className="text-sm text-muted-foreground">Security Deposit</dt>
                  <dd className="text-lg font-medium">
                    ${lease.deposit_amount.toLocaleString()}
                  </dd>
                </>
              )}
              {lease.escalation_rate && (
                <>
                  <dt className="text-sm text-muted-foreground">Annual Increase</dt>
                  <dd className="text-lg font-medium">{lease.escalation_rate}%</dd>
                </>
              )}
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lease.pdf_url ? (
              <Button onClick={downloadLease} variant="outline" className="w-full">
                Download Lease Agreement
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                No lease document uploaded
              </p>
            )}
          </CardContent>
        </Card>

        {lease.insights && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Lease Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Duration</h3>
                  <p className="text-sm text-muted-foreground">
                    {lease.insights.leaseDuration.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Financial Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    {lease.insights.financials.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Property Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {lease.insights.property.description}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Tenant Information</h3>
                  <p className="text-sm text-muted-foreground">
                    {lease.insights.tenant.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      Due: {format(new Date(payment.due_date), 'PPP')}
                    </p>
                    {payment.paid_date && (
                      <p className="text-sm text-muted-foreground">
                        Paid: {format(new Date(payment.paid_date), 'PPP')}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toLocaleString()}</p>
                    <p className={`text-sm ${
                      payment.status === 'PAID' 
                        ? 'text-green-600' 
                        : payment.status === 'PENDING' 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment records found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};