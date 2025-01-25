import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";

export const RevenueChart = () => {
  const data = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 25000 },
    { month: 'Apr', revenue: 32000 },
    { month: 'May', revenue: 35000 },
    { month: 'Jun', revenue: 30000 },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: '#6B7280', 
                    fontSize: 12,
                    dy: 12
                  }}
                  interval={0}
                  height={40}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: '#6B7280', 
                    fontSize: 12 
                  }}
                  tickFormatter={formatCurrency}
                  width={80}
                  dx={-10}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ 
                    color: '#374151', 
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={{
                    stroke: '#2563EB',
                    strokeWidth: 2,
                    r: 4,
                    fill: '#FFFFFF'
                  }}
                  activeDot={{
                    stroke: '#2563EB',
                    strokeWidth: 2,
                    r: 6,
                    fill: '#FFFFFF'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};