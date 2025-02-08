
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type AIAlert = Database["public"]["Tables"]["ai_alerts"]["Row"];

export const AlertsList = () => {
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['ai-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as AIAlert[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            Unable to load alerts. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts && alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`ml-auto text-xs font-medium ${
                  alert.priority === 'HIGH' ? 'text-red-500' : 
                  alert.priority === 'MEDIUM' ? 'text-yellow-500' : 
                  'text-green-500'
                }`}>
                  {alert.priority}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-4">
              No alerts to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
