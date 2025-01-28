import { Navigation } from "@/components/how-it-works/Navigation";
import { OnboardingProcess } from "@/components/how-it-works/OnboardingProcess";
import { KeyFeatures } from "@/components/how-it-works/KeyFeatures";
import { GettingStartedCTA } from "@/components/how-it-works/GettingStartedCTA";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          <Navigation />
          <div className="container mx-auto px-4 py-8 sm:py-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">How ManageLeaseAI Works</h1>
            <p className="text-lg sm:text-xl text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
              Discover how our AI-powered platform revolutionizes commercial lease management, from onboarding to advanced
              analytics.
            </p>
            <OnboardingProcess />
            <KeyFeatures />
            <GettingStartedCTA />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;