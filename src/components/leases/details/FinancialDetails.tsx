import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface FinancialDetailsProps {
  monthlyRent: number;
  depositAmount: number | null;
  escalationRate: number | null;
}

export const FinancialDetails = ({ monthlyRent, depositAmount, escalationRate }: FinancialDetailsProps) => {
  return (
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
            ${monthlyRent.toLocaleString()}
          </dd>
          {depositAmount && (
            <>
              <dt className="text-sm text-muted-foreground">Security Deposit</dt>
              <dd className="text-lg font-medium">
                ${depositAmount.toLocaleString()}
              </dd>
            </>
          )}
          {escalationRate && (
            <>
              <dt className="text-sm text-muted-foreground">Annual Increase</dt>
              <dd className="text-lg font-medium">{escalationRate}%</dd>
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};