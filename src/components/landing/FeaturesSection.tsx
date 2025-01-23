export default function FeaturesSection() {
  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "AI-Powered Lease Management",
            description: "Automate lease tracking, renewals, and compliance monitoring with advanced AI technology."
          },
          {
            title: "Predictive Maintenance",
            description: "Anticipate maintenance needs before they become issues, saving time and resources."
          },
          {
            title: "Real-time Analytics",
            description: "Get instant insights into your property portfolio's performance and occupancy rates."
          }
        ].map((feature, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}