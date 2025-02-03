import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardCharts = () => {
  const { data: properties } = useQuery({
    queryKey: ['owner-properties-chart'],
    queryFn: async () => {
      const { data: userData } = await supabase
        .from('users')
        .select('owner_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userData?.owner_id) return [];

      const { data, error } = await supabase
        .from('properties')
        .select('*, units(*)')
        .eq('owner_reference_id', userData.owner_id);

      if (error) throw error;
      return data;
    }
  });

  const occupancyData = properties?.map(property => ({
    name: property.name,
    total: property.units?.length || 0,
    occupied: property.units?.filter(u => u.status === 'OCCUPIED').length || 0,
    vacant: property.units?.filter(u => u.status === 'VACANT').length || 0,
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Property Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="occupied" fill="#22c55e" name="Occupied" />
                <Bar dataKey="vacant" fill="#ef4444" name="Vacant" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};