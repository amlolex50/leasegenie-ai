import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Brain, BarChart3, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      {/* Navigation */}
      <div className="w-full bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-blue-500 text-2xl">★</span>
              <span className="font-semibold text-xl">LeaseGenie AI</span>
            </Link>
            <div className="hidden md:flex items-center gap-12">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
              <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
            </div>
            <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16 text-center">
          <h1 className="text-4xl font-bold mb-6">LeaseGenie AI Features</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of property management with our advanced AI-powered features
          </p>
        </section>

        {/* AI-Driven Lease Management */}
        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center">AI-Driven Lease Management</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6 text-gray-700">
                LeaseGenie AI revolutionizes lease management with advanced artificial intelligence. Our system automates
                lease abstraction, provides smart notifications, and offers valuable negotiation insights.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Automated lease data extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Intelligent clause analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Proactive deadline reminders</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>AI-powered negotiation recommendations</span>
                </li>
              </ul>
            </div>
            <div className="glass-card p-8 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Predictive Maintenance */}
        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center">Predictive Maintenance & Repair</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
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
              <p className="text-lg mb-6 text-gray-700">
                Stay ahead of maintenance issues with our predictive analytics. LeaseGenie AI uses historical data and
                machine learning to forecast potential problems before they occur.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Predictive maintenance scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Cost-saving recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Automated work order generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Vendor performance tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12 text-blue-600" />,
                title: "AI-Powered Insights",
                description: "Leverage artificial intelligence for smarter decision-making in lease management."
              },
              {
                icon: <BarChart3 className="w-12 h-12 text-green-600" />,
                title: "Comprehensive Analytics",
                description: "Gain a 360-degree view of your property portfolio with advanced analytics."
              },
              {
                icon: <Shield className="w-12 h-12 text-red-600" />,
                title: "Enhanced Security",
                description: "Rest easy knowing your data is protected with state-of-the-art security."
              }
            ].map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex flex-col items-center gap-4">
                    {feature.icon}
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Property Management?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of property managers who are already using LeaseGenie AI to streamline their operations.
          </p>
          <Button 
            size="lg"
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8 py-6"
            onClick={() => navigate('/auth')}
          >
            Get Started Now
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Features;