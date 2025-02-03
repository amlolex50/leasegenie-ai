import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-blue-500 text-2xl">★</span>
            <span className="font-semibold text-xl">ManageLeaseAI</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-12">
          <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
          <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
        </div>
        <Button 
          className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
          onClick={() => navigate('/auth')}
        >
          Get Started
        </Button>
      </div>
    </nav>
  );
};