import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bell, Shield } from "lucide-react";

export const KeyFeatures = () => {
  return (
    <section className="mb-12 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">Key Features in Action</h2>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="dashboard">Smart Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Intelligent Notifications</TabsTrigger>
          <TabsTrigger value="security">Data Security</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Smart Dashboard</CardTitle>
              <CardDescription>
                Get a bird's-eye view of your entire portfolio with our intuitive dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our intelligent dashboard provides a comprehensive overview of your lease portfolio, including:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Total number of properties and leases</li>
                <li>Occupancy rates and vacancy insights</li>
                <li>Upcoming lease expirations and renewals</li>
                <li>Financial summaries and projections</li>
              </ul>
              <div 
                className="mt-4 h-48 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80")' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Leverage AI-powered insights to make data-driven decisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our advanced analytics feature provides deep insights into your lease portfolio:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Predictive maintenance forecasting</li>
                <li>Rent trend analysis and projections</li>
                <li>Tenant health scoring</li>
                <li>Customizable reports and visualizations</li>
              </ul>
              <div 
                className="mt-4 h-48 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80")' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Intelligent Notifications</CardTitle>
              <CardDescription>Stay on top of critical lease events with AI-driven alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>LeaseGenie AI keeps you informed with timely notifications:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Lease expiration reminders</li>
                <li>Rent increase notifications</li>
                <li>Maintenance due alerts</li>
                <li>Compliance deadline warnings</li>
              </ul>
              <div 
                className="mt-4 h-48 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80")' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
              <CardDescription>Your lease data is protected with enterprise-grade security measures.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We prioritize the security of your sensitive lease information:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>End-to-end encryption for all data</li>
                <li>Regular security audits and penetration testing</li>
                <li>Role-based access control</li>
                <li>Compliance with industry standards (GDPR, CCPA, etc.)</li>
              </ul>
              <div 
                className="mt-4 h-48 sm:h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80")' }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};