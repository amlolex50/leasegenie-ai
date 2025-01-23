export default function InfoSections() {
  return (
    <div className="py-16">
      <div className="space-y-24">
        {[
          {
            title: "Streamline Your Property Management",
            description: "Manage all your commercial properties from a single, intuitive dashboard. Track leases, maintenance requests, and tenant communications effortlessly."
          },
          {
            title: "Make Data-Driven Decisions",
            description: "Access comprehensive analytics and insights about your property portfolio. Understand occupancy trends, revenue patterns, and maintenance costs at a glance."
          },
          {
            title: "Automate Routine Tasks",
            description: "Let AI handle the repetitive tasks while you focus on growing your business. Automated rent collection, maintenance scheduling, and lease renewals save you time and reduce errors."
          }
        ].map((section, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
              <p className="text-lg text-gray-600">{section.description}</p>
            </div>
            <div className="flex-1">
              <div className="aspect-video bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}