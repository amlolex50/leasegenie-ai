import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const AlertsList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { title: "Lease Expiring Soon", property: "123 Main St, Unit 101", priority: "HIGH" },
            { title: "Maintenance Due", property: "456 Oak Ave, Unit 202", priority: "MEDIUM" },
            { title: "Rent Payment Overdue", property: "789 Pine St, Unit 303", priority: "HIGH" },
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.property}</p>
              </div>
              <span className={`ml-auto text-xs font-medium ${
                alert.priority === 'HIGH' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {alert.priority}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};