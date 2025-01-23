import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function InfoSections() {
  return (
    <div className="py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        {/* Left Section */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
            How It Works
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Comprehensive<br />
              <span className="text-blue-500">Lease Management</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Leveraging advanced AI technology and extensive property management expertise, 
              we streamline your lease operations. We focus on delivering intelligent automation 
              and insights for optimal portfolio performance.
            </p>
            <Button variant="default" className="rounded-full bg-black text-white hover:bg-black/90">
              Discover LeaseGenie AI
            </Button>
          </div>

          <div className="mt-12">
            <div className="relative w-64 h-64">
              <div className="rounded-full overflow-hidden">
                {/* Pie Chart Visualization */}
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                  <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0 100%, 0 0, 50% 0)' }}></div>
                  <div className="absolute inset-0 bg-orange-500" style={{ clipPath: 'polygon(85% 85%, 100% 50%, 100% 100%)' }}></div>
                </div>
              </div>
              {/* Labels */}
              <div className="absolute top-0 right-0 text-sm">Enterprise 50%</div>
              <div className="absolute bottom-0 left-0 text-sm">Growth 30%</div>
              <div className="absolute bottom-0 right-0 text-sm">Starter 20%</div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Total Properties</h3>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold">3246K</span>
                <span className="text-green-500 text-sm">↑ 3.1% From last week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
            How It Works
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-4">
              In-Depth<br />
              <span className="text-blue-500">Portfolio Analysis</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We start by understanding your specific portfolio requirements through detailed analysis. 
              Our AI system works continuously to identify opportunities and risks across your properties.
            </p>
            <Button variant="default" className="rounded-full bg-black text-white hover:bg-black/90">
              Discover LeaseGenie AI
            </Button>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Top Properties</h3>
            <div className="space-y-4">
              {[
                {
                  name: "Skyline Tower",
                  type: "Commercial Office",
                  period: "2023 - Present"
                },
                {
                  name: "Harbor Point Mall",
                  type: "Retail Complex",
                  period: "2022 - Present"
                },
                {
                  name: "Tech Park One",
                  type: "Mixed Use",
                  period: "2023 - Present"
                }
              ].map((property, index) => (
                <Card key={index} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{property.name}</h4>
                    <p className="text-sm text-gray-500">
                      {property.type} • {property.period}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}