import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Brain, BarChart3, Users, Bot, Shield, Cog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const barChartData = [
    { name: "Manual Process", value: 100 },
    { name: "With LeaseGenie AI", value: 25 },
  ];

  const lineChartData = [
    { date: "Jan", "Maintenance Costs": 4000, "Predicted Costs": 3800 },
    { date: "Feb", "Maintenance Costs": 3800, "Predicted Costs": 3600 },
    { date: "Mar", "Maintenance Costs": 3600, "Predicted Costs": 3400 },
    { date: "Apr", "Maintenance Costs": 3400, "Predicted Costs": 3200 },
    { date: "May", "Maintenance Costs": 3200, "Predicted Costs": 3000 },
  ];

  const pieChartData = [
    { name: "Occupied", value: 75 },
    { name: "Vacant", value: 25 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 py-4 shadow-md rounded-[20px] bg-white mt-8 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">★</span>
            <span className="font-semibold text-xl">LeaseGenie AI</span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</a>
            <a href="#about-us" className="text-gray-600 hover:text-gray-900">About Us</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
          </div>
          <Button 
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </nav>

        <div className="py-16">
          <h1 className="text-4xl font-bold text-center mb-8">LeaseGenie AI Features</h1>

          {/* AI-Driven Lease Management */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">AI-Driven Lease Management</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg mb-4">
                  LeaseGenie AI revolutionizes lease management with advanced artificial intelligence. Our system automates
                  lease abstraction, provides smart notifications, and offers valuable negotiation insights.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Automated lease data extraction</li>
                  <li>Intelligent clause analysis</li>
                  <li>Proactive deadline reminders</li>
                  <li>AI-powered negotiation recommendations</li>
                </ul>
              </div>
              <div className="bg-gray-100 p-6 rounded-lg h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Predictive Maintenance */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Predictive Maintenance & Repair</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-100 p-6 rounded-lg h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Maintenance Costs" stroke="#8884d8" />
                    <Line type="monotone" dataKey="Predicted Costs" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-lg mb-4">
                  Stay ahead of maintenance issues with our predictive analytics. LeaseGenie AI uses historical data and
                  machine learning to forecast potential problems before they occur.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Predictive maintenance scheduling</li>
                  <li>Cost-saving recommendations</li>
                  <li>Automated work order generation</li>
                  <li>Vendor performance tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Dedicated Portals */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Dedicated Portals for All Stakeholders</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Landlord Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="w-12 h-12 mb-4 text-blue-600" />
                  <p>Comprehensive overview of all properties, leases, and financial data.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tenant Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="w-12 h-12 mb-4 text-green-600" />
                  <p>Easy access to lease details, maintenance requests, and payment history.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <Users className="w-12 h-12 mb-4 text-orange-600" />
                  <p>Streamlined work order management and communication tools.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Analytics Dashboard */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-6">Powerful Analytics Dashboard</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-100 p-6 rounded-lg h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-lg mb-4">
                  Gain valuable insights into your property portfolio with our comprehensive analytics dashboard. Visualize
                  key metrics and make data-driven decisions.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time occupancy rates</li>
                  <li>Financial performance tracking</li>
                  <li>Maintenance cost analysis</li>
                  <li>Customizable reports and exports</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Feature Summary */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Why Choose LeaseGenie AI?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Brain className="w-8 h-8 mb-2 text-blue-600" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Leverage artificial intelligence for smarter decision-making in lease management.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="w-8 h-8 mb-2 text-green-600" />
                  <CardTitle>Comprehensive Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Gain a 360-degree view of your property portfolio with advanced analytics and reporting.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="w-8 h-8 mb-2 text-red-600" />
                  <CardTitle>Enhanced Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Rest easy knowing your data is protected with state-of-the-art security measures.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bot className="w-8 h-8 mb-2 text-purple-600" />
                  <CardTitle>24/7 AI Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Get instant assistance anytime with our AI-powered chatbot.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 mb-2 text-orange-600" />
                  <CardTitle>Stakeholder Portals</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Provide tailored experiences for landlords, tenants, and vendors with dedicated portals.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Cog className="w-8 h-8 mb-2 text-indigo-600" />
                  <CardTitle>Customizable & Scalable</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Adapt LeaseGenie AI to your specific needs and grow with your business.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => navigate('/auth')}
            >
              Get Started with LeaseGenie AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;