import { FeatureHeader } from "@/components/features/FeatureHeader";
import { AIManagementSection } from "@/components/features/AIManagementSection";
import { PredictiveMaintenanceSection } from "@/components/features/PredictiveMaintenanceSection";
import { KeyFeaturesSection } from "@/components/features/KeyFeaturesSection";
import { FeatureCTA } from "@/components/features/FeatureCTA";

const Features = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <FeatureHeader />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-16 text-center">
            <h1 className="text-4xl font-bold mb-6">LeaseGenie AI Features</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of property management with our advanced AI-powered features
            </p>
          </section>

          <AIManagementSection />
          <PredictiveMaintenanceSection />
          <KeyFeaturesSection />
          <FeatureCTA />
        </div>
      </main>
    </div>
  );
};

export default Features;