import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const lineChartData = [
  { date: "Jan", "Maintenance Costs": 4000, "Predicted Costs": 3800 },
  { date: "Feb", "Maintenance Costs": 3800, "Predicted Costs": 3600 },
  { date: "Mar", "Maintenance Costs": 3600, "Predicted Costs": 3400 },
  { date: "Apr", "Maintenance Costs": 3400, "Predicted Costs": 3200 },
  { date: "May", "Maintenance Costs": 3200, "Predicted Costs": 3000 },
];

export const PredictiveMaintenanceSection = () => {
  return (
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
  );
};