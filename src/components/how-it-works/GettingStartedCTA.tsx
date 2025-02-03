import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const GettingStartedCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="text-center py-12">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Ready to Transform Your Lease Management?</h2>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-muted-foreground">
        Join thousands of satisfied property managers and experience the power of intelligent lease management.
      </p>
      <Button 
        size="lg" 
        className="bg-primary text-white hover:bg-primary/90"
        onClick={() => navigate('/auth')}
      >
        Start Your Free Trial
      </Button>
    </section>
  );
};