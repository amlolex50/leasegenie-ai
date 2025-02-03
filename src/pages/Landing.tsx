import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InfoSections from "@/components/landing/InfoSections";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { ChartBar, ListChecks, Building2, Users, Wrench, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const revenueData = [
  { month: 'Jan', revenue: 35000 },
  { month: 'Feb', revenue: 42000 },
  { month: 'Mar', revenue: 38000 },
  { month: 'Apr', revenue: 45000 },
  { month: 'May', revenue: 43000 },
  { month: 'Jun', revenue: 48000 },
];

const occupancyData = [
  { name: 'Occupied', value: 85 },
  { name: 'Vacant', value: 15 },
];

const maintenanceData = [
  { month: 'Jan', requests: 12 },
  { month: 'Feb', requests: 15 },
  { month: 'Mar', requests: 10 },
  { month: 'Apr', requests: 8 },
  { month: 'May', requests: 14 },
  { month: 'Jun', requests: 11 },
];

const COLORS = ['#0088FE', '#FF8042'];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        
        {/* Analytics Preview Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Real-Time Analytics Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <ChartBar className="w-8 h-8 text-blue-500" />
                <h3 className="text-xl font-semibold">Revenue Tracking</h3>
              </div>
              <div className="h-[200px]">
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
                      dot={{ r: 4 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <Building2 className="w-8 h-8 text-green-500" />
                <h3 className="text-xl font-semibold">Occupancy Rate</h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={2000}
                    >
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <Wrench className="w-8 h-8 text-orange-500" />
                <h3 className="text-xl font-semibold">Maintenance Trends</h3>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="requests" 
                      fill="#FF8042"
                      animationDuration={2000}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>

        {/* Key Features List */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Comprehensive Property Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <ListChecks className="w-8 h-8 text-blue-500" />
                  <h3 className="text-xl font-semibold">Lease Management</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Automated rent collection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Digital lease signing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Tenant screening</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <Users className="w-8 h-8 text-green-500" />
                  <h3 className="text-xl font-semibold">Tenant Portal</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Online maintenance requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Document management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Communication hub</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <DollarSign className="w-8 h-8 text-purple-500" />
                  <h3 className="text-xl font-semibold">Financial Tools</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>Expense tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>Financial reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>Budget forecasting</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <Wrench className="w-8 h-8 text-orange-500" />
                  <h3 className="text-xl font-semibold">Maintenance</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Work order management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Vendor coordination</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Preventive maintenance</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </section>

        <InfoSections />
        <FeaturesSection />
        
        {/* Testimonials */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "LeaseGenie AI has revolutionized how we manage our commercial properties. It's like having a team of experts working 24/7.",
                author: "Sarah Johnson",
                role: "Property Manager, NYC"
              },
              {
                quote: "The predictive maintenance feature alone has saved us thousands in potential repairs. This platform is a game-changer.",
                author: "Michael Chen",
                role: "Commercial Landlord, San Francisco"
              },
              {
                quote: "As a tenant, I appreciate the transparency and ease of communication. It's made our lease management so much smoother.",
                author: "Emily Rodriguez",
                role: "Retail Store Owner, Chicago"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-lg">{testimonial.author[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Case Studies", "FAQ"]
              },
              {
                title: "Company",
                links: ["About", "Careers", "Contact", "Partners"]
              },
              {
                title: "Resources",
                links: ["Blog", "Webinars", "Documentation", "Support"]
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
              }
            ].map((section, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <span className="text-primary text-2xl mr-2">★</span>
              <span className="text-xl font-semibold">ManageLeaseAI</span>
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-400">
              &copy; {new Date().getFullYear()} ManageLeaseAI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}