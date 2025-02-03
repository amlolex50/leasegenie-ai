import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BarChart3, Shield } from "lucide-react";

const features = [
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
];

export const KeyFeaturesSection = () => {
  return (
    <section className="mb-24">
      <h2 className="text-3xl font-semibold mb-12 text-center">Key Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
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
  );
};