import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { LeaseInsights as LeaseInsightsType } from "../LeaseDetails";

interface LeaseInsightsProps {
  insights: LeaseInsightsType;
}

export const LeaseInsightsSection = ({ insights }: LeaseInsightsProps) => {
  return (
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
              {insights.leaseDuration.description}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Financial Overview</h3>
            <p className="text-sm text-muted-foreground">
              {insights.financials.description}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Property Details</h3>
            <p className="text-sm text-muted-foreground">
              {insights.property.description}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Tenant Information</h3>
            <p className="text-sm text-muted-foreground">
              {insights.tenant.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};