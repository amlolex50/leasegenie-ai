import { useNavigate, Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  Moon,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Navigation */}
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
            </div>
            <Button 
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
          </nav>

          {/* Dashboard Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <span className="text-blue-500 text-2xl">★</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Home / Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-4 py-2 rounded-lg bg-gray-50 text-sm w-64 border border-gray-200"
                />
                <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-gray-50">
                <Moon className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-600" />
              </Button>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;