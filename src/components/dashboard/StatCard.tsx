import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  trend?: string;
}

export const StatCard = ({ icon: Icon, label, value, trend }: StatCardProps) => (
  <Card className="hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm border-blue-100">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
      <Icon className="h-4 w-4 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-900">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </CardContent>
  </Card>
);