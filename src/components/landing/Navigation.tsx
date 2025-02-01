import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm px-4 md:px-8 py-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-blue-500 text-2xl">★</span>
              <span className="font-semibold text-xl">ManageLeaseAI</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
            <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
            <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-gray-600 hover:text-gray-900 py-2">Home</Link>
            <Link to="/features" className="block text-gray-600 hover:text-gray-900 py-2">Features</Link>
            <Link to="/how-it-works" className="block text-gray-600 hover:text-gray-900 py-2">How It Works</Link>
            <Link to="/about" className="block text-gray-600 hover:text-gray-900 py-2">About Us</Link>
            <Link to="/testimonials" className="block text-gray-600 hover:text-gray-900 py-2">Testimonials</Link>
            <Button 
              className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};