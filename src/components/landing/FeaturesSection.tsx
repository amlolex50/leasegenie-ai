import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Lease Management",
      icon: "🤖",
      description: "Intelligent lease management with AI insights and automation.",
      bulletPoints: [
        "Smart Lease Analysis: AI extracts and summarizes key terms",
        "Automated Rent Calculations: Precise rent escalations and deposit tracking",
        "Risk Assessment: AI evaluates lease terms and potential issues"
      ]
    },
    {
      title: "Predictive Maintenance",
      icon: "🔧",
      description: "AI-driven maintenance management to prevent issues before they occur.",
      bulletPoints: [
        "Predictive Analytics: Identify potential maintenance needs early",
        "Smart Work Order Routing: AI assigns tasks to the right contractors",
        "Cost Optimization: AI suggests maintenance schedules for cost savings"
      ]
    },
    {
      title: "AI Tenant Assistant",
      icon: "💬",
      description: "24/7 AI support for tenant inquiries and requests.",
      bulletPoints: [
        "Instant Response: AI handles common questions and maintenance requests",
        "Smart Scheduling: Automated maintenance appointment booking",
        "Document Management: AI helps organize lease documents and records"
      ]
    },
    {
      title: "Landlord Intelligence Suite",
      icon: "📊",
      description: "AI insights for better property management decisions.",
      bulletPoints: [
        "Market Analysis: AI-powered rent and property value insights",
        "Tenant Screening: Advanced AI risk assessment for applicants",
        "Financial Forecasting: Predictive analytics for property performance"
      ]
    },
    {
      title: "Smart Communication Hub",
      icon: "📱",
      description: "AI-enhanced communication between tenants and landlords.",
      bulletPoints: [
        "Automated Updates: Smart notifications for important events",
        "Translation Support: Real-time AI translation for diverse tenants",
        "Smart Templates: AI-generated responses for common situations"
      ]
    },
    {
      title: "Compliance Assistant",
      icon: "✅",
      description: "AI-powered compliance monitoring and management.",
      bulletPoints: [
        "Regulatory Tracking: AI monitors changing property laws",
        "Document Verification: Automated compliance checking",
        "Smart Reminders: Proactive alerts for compliance deadlines"
      ]
    },
    {
      title: "Property Performance Analytics",
      icon: "📈",
      description: "Advanced AI analytics for property portfolio optimization.",
      bulletPoints: [
        "Performance Metrics: AI-driven property performance tracking",
        "Optimization Suggestions: Smart recommendations for improvements",
        "Trend Analysis: AI identifies patterns and opportunities"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Property Management <span className="text-blue-600">Made Simple</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience the future of property management with our advanced AI features that make
            managing properties, tenants, and maintenance effortless and efficient.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {features.map((feature, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-6">
                  <div className="bg-white rounded-xl shadow-md p-6 h-full">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.bulletPoints.map((point, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-sm text-gray-600">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}