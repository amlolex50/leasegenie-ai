import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface LeasePeriodProps {
  startDate: string;
  endDate: string;
}

export const LeasePeriod = ({ startDate, endDate }: LeasePeriodProps) => {
  return (
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
            {format(new Date(startDate), 'PPP')}
          </dd>
          <dt className="text-sm text-muted-foreground">End Date</dt>
          <dd className="text-lg font-medium">
            {format(new Date(endDate), 'PPP')}
          </dd>
        </dl>
      </CardContent>
    </Card>
  );
};