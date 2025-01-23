import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Building, DollarSign, Wrench, Users } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend?: string }) => (
  <Card className="p-6 backdrop-blur-sm bg-card border shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && <p className="text-xs text-accent mt-1">{trend}</p>}
      </div>
      <Icon className="w-5 h-5 text-primary opacity-50" />
    </div>
  </Card>
);

const Index = () => {
  const stats = [
    { icon: Building, label: "Total Properties", value: "12", trend: "+2 this month" },
    { icon: Users, label: "Active Tenants", value: "45", trend: "+5 this month" },
    { icon: DollarSign, label: "Monthly Revenue", value: "$52,000", trend: "+8% vs last month" },
    { icon: Wrench, label: "Pending Maintenance", value: "3", trend: "-2 this week" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your properties today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/50">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-medium">New maintenance request</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Renewals</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium">Unit {i}01</p>
                    <p className="text-xs text-muted-foreground">Expires in {i * 10} days</p>
                  </div>
                  <button className="text-xs text-accent hover:underline">Review</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;