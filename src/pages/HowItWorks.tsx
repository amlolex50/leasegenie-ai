import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Database, Bot, BarChart, Bell, Shield } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function HowItWorks() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">How LeaseGenie AI Works</h1>
        <p className="text-lg sm:text-xl text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
          Discover how our AI-powered platform revolutionizes commercial lease management, from onboarding to advanced
          analytics.
        </p>

        {/* Onboarding Process */}
        <section className="mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">
            Getting Started with LeaseGenie AI
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card>
              <CardHeader>
                <Upload className="w-12 h-12 mb-4 text-blue-600" />
                <CardTitle>1. Upload Your Leases</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Simply upload your existing lease documents in PDF format. Our AI will automatically extract and
                  organize key information.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Database className="w-12 h-12 mb-4 text-green-600" />
                <CardTitle>2. AI Data Extraction</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  LeaseGenie AI analyzes your documents, extracting crucial details like rent amounts, important dates,
                  and special clauses.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader>
                <Bot className="w-12 h-12 mb-4 text-purple-600" />
                <CardTitle>3. Verify and Customize</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Review the extracted data, make any necessary adjustments, and customize your dashboard to suit your
                  needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Features in Action */}
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
                  <p>The LeaseGenie AI dashboard provides a comprehensive overview of your lease portfolio, including:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Total number of properties and leases</li>
                    <li>Occupancy rates and vacancy insights</li>
                    <li>Upcoming lease expirations and renewals</li>
                    <li>Financial summaries and projections</li>
                  </ul>
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Getting Started CTA */}
        <section className="text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ready to Transform Your Lease Management?</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8">
            Join thousands of satisfied property managers and experience the power of AI-driven lease management.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
            Start Your Free Trial
          </Button>
        </section>
      </div>
    </DashboardLayout>
  )
}