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
      title: "AI-Driven Lease Management",
      icon: "🧠",
      description: "Upload your commercial leases and let AI extract critical data, provide smart notifications, and offer negotiation insights.",
      bulletPoints: [
        "Automated Lease Abstraction: Extract critical data from PDFs and documents",
        "Smart Notifications: Get proactive warnings about important deadlines",
        "Negotiation Insights: AI-powered market analysis and recommendations"
      ]
    },
    {
      title: "Predictive Maintenance & Repair",
      icon: "🔧",
      description: "Leverage AI to predict and prevent maintenance issues while optimizing costs and contractor management.",
      bulletPoints: [
        "Data-Driven Maintenance Forecasting: Spot potential failures before they occur",
        "Smart Work Orders: Automatic assignment to qualified contractors",
        "Cost Analysis & Budgeting: AI-powered maintenance cost optimization"
      ]
    },
    {
      title: "Dedicated Portals for Stakeholders",
      icon: "👥",
      description: "Provide tailored access and functionality for landlords, tenants, and contractors.",
      bulletPoints: [
        "Landlord Portal: Complete visibility into property operations",
        "Tenant Portal: Easy access to lease details and maintenance requests",
        "Contractor Portal: Streamlined task and schedule management"
      ]
    },
    {
      title: "Conversational AI Agent",
      icon: "🤖",
      description: "24/7 virtual assistance for all stakeholders with intelligent issue resolution.",
      bulletPoints: [
        "24/7 Virtual Assistant: AI-powered chat support",
        "Automated Issue Resolution: Instant categorization and escalation",
        "Adaptive Learning: Continuous improvement through feedback"
      ]
    },
    {
      title: "Commercial-Focused Analytics",
      icon: "📊",
      description: "Comprehensive insights into your property portfolio performance.",
      bulletPoints: [
        "Real-Time Financial Insights: Detailed performance dashboards",
        "Tenant Health Tracking: Early warning system for risks",
        "Market Comparisons: Competitive benchmarking tools"
      ]
    },
    {
      title: "Compliance & Risk Mitigation",
      icon: "🛡️",
      description: "Stay compliant and minimize risks with automated tracking and documentation.",
      bulletPoints: [
        "Regulatory Tracking: Built-in compliance monitoring",
        "Insurance Documentation: Automated certificate management",
        "Audit Trails: Complete historical records"
      ]
    },
    {
      title: "Customization & Integration",
      icon: "🔌",
      description: "Flexible solutions that adapt to your needs and integrate with your existing tools.",
      bulletPoints: [
        "Modular Architecture: Customizable feature set",
        "API & App Marketplace: Ready-to-use integrations",
        "White-Label Option: Branded experience available"
      ]
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Us? <span className="text-blue-600">Discover The Advantages</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At LeaseGenie, We Pride Ourselves On Providing Exceptional Property Management Solutions That
            Drive Your Business Forward. Here's Why Our Clients Trust Us To Meet Their Needs:
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