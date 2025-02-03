import { Navigation } from "@/components/landing/Navigation";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Brain, Shield, Bell, BarChart as BarChartIcon } from "lucide-react";

const Features = () => {
  const processTimeData = [
    { name: 'Manual Process', time: 100 },
    { name: 'With LeaseGenie AI', time: 25 },
  ];

  const maintenanceData = [
    { month: 'Jan', incidents: 12 },
    { month: 'Feb', incidents: 8 },
    { month: 'Mar', incidents: 5 },
    { month: 'Apr', incidents: 3 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">LeaseGenie AI Features</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the future of property management with our advanced AI-powered features
            </p>
          </div>

          {/* AI-Driven Lease Management Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">AI-Driven Lease Management</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">
                  LeaseGenie AI revolutionizes lease management with advanced artificial intelligence. 
                  Our system automates lease abstraction, provides smart notifications, and offers 
                  valuable negotiation insights.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span>Automated lease data extraction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>Intelligent clause analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <span>Proactive deadline reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5 text-blue-500" />
                    <span>AI-powered negotiation recommendations</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <BarChart width={500} height={300} data={processTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="time" fill="#818CF8" />
                </BarChart>
              </div>
            </div>
          </section>

          {/* Predictive Maintenance Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Predictive Maintenance & Repair</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <LineChart width={500} height={300} data={maintenanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="incidents" stroke="#818CF8" strokeWidth={2} />
                </LineChart>
              </div>
              <div>
                <p className="text-lg mb-6">
                  Our AI system predicts maintenance needs before they become critical issues, 
                  helping you save time and money while keeping your properties in top condition.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    <span>Early issue detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>Automated maintenance scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <span>Cost prediction and budgeting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChartIcon className="w-5 h-5 text-blue-500" />
                    <span>Maintenance history analysis</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Property Management?</h2>
            <p className="text-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              Join thousands of property managers who are already benefiting from our AI-powered platform.
            </p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors">
              Get Started Today
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Features;