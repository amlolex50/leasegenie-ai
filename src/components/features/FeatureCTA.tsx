import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FeatureCTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 text-center">
      <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Property Management?</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Join thousands of property managers who are already using LeaseGenie AI to streamline their operations.
      </p>
      <Button 
        size="lg"
        className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8 py-6"
        onClick={() => navigate('/auth')}
      >
        Get Started Now
      </Button>
    </section>
  );
};