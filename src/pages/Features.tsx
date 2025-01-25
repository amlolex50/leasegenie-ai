import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartBar, ChartPie, Trophy, Star, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const revenueData = [
    { month: 'Jan', revenue: 32000 },
    { month: 'Feb', revenue: 28000 },
    { month: 'Mar', revenue: 25000 },
    { month: 'Apr', revenue: 32000 },
    { month: 'May', revenue: 35000 },
    { month: 'Jun', revenue: 30000 },
  ];

  const pieData = [
    { name: 'Commercial', value: 45 },
    { name: 'Residential', value: 30 },
    { name: 'Mixed Use', value: 25 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const features = [
    {
      icon: <ChartBar className="w-8 h-8 text-blue-500" />,
      title: "Advanced Analytics",
      description: "Comprehensive insights into your property portfolio performance with real-time data visualization."
    },
    {
      icon: <ChartPie className="w-8 h-8 text-green-500" />,
      title: "Portfolio Management",
      description: "Efficiently manage diverse property types with our intuitive dashboard."
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: "AI-Powered Insights",
      description: "Leverage machine learning for predictive maintenance and market analysis."
    },
    {
      icon: <Star className="w-8 h-8 text-purple-500" />,
      title: "Document Management",
      description: "Centralized storage for all your property-related documents and contracts."
    },
    {
      icon: <Award className="w-8 h-8 text-red-500" />,
      title: "Automated Reporting",
      description: "Generate comprehensive reports with just a few clicks."
    }
  ];

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
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-gray-50 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Revenue Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#0088FE" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Property Distribution Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Property Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Property Management" 
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Team Collaboration" 
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
