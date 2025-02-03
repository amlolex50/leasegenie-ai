import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const FeatureHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-blue-500 text-2xl">★</span>
          <span className="font-semibold text-xl">LeaseGenie AI</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
            <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
          </nav>
          <Button 
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};