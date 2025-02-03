import { Navigation } from "@/components/how-it-works/Navigation";
import { OnboardingProcess } from "@/components/how-it-works/OnboardingProcess";
import { KeyFeatures } from "@/components/how-it-works/KeyFeatures";
import { GettingStartedCTA } from "@/components/how-it-works/GettingStartedCTA";

const HowItWorks = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              How ManageLeaseAI Works
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how our AI-powered platform revolutionizes commercial lease management, from onboarding to advanced
              analytics.
            </p>
          </div>
          <OnboardingProcess />
          <KeyFeatures />
          <GettingStartedCTA />
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;