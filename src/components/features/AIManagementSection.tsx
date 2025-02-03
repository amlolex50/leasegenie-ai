import { BarChart } from "recharts";
import { ResponsiveContainer } from "recharts";

const barChartData = [
  { name: "Manual Process", value: 100 },
  { name: "With LeaseGenie AI", value: 25 },
];

export const AIManagementSection = () => {
  return (
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
  );
};