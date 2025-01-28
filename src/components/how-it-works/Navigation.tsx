import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-md rounded-[20px] relative z-10">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-blue-500 text-2xl">★</span>
          <span className="font-semibold text-xl">ManageLeaseAi</span>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-12">
        <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
        <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
        <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">How It Works</Link>
        <Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link>
        <Link to="/testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</Link>
        <Link to="/maintenance" className="text-gray-600 hover:text-gray-900">Maintenance</Link>
      </div>
      <Button 
        className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
        onClick={() => navigate('/auth')}
      >
        Get Started
      </Button>
    </nav>
  );
};