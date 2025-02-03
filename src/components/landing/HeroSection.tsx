import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bell, Home, Search, Settings, Users } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Your Intelligent Partner For
              <br />
              <span className="text-blue-500">
                Commercial Lease
                <br />
                Management
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering commercial landlords and property managers with AI-driven lease management, predictive maintenance, and automated support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                variant="outline" 
                className="rounded-full px-8 py-2 sm:py-3 text-base"
                onClick={() => navigate('/auth')}
              >
                Learn More
              </Button>
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8 py-2 sm:py-3 text-base"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Dashboard Preview Section */}
          <div className="mt-16 sm:mt-24 w-full">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="text-blue-500 text-2xl">★</div>
                  <div className="text-sm text-gray-600">Home / Dashboard</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search Talent..."
                      className="pl-9 pr-4 py-2 rounded-lg bg-gray-50 text-sm w-64 border border-gray-200"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <button className="p-2 rounded-lg hover:bg-gray-50">
                    <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    A
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex">
                {/* Sidebar */}
                <div className="w-16 bg-white border-r border-gray-100 p-4">
                  <div className="space-y-6">
                    <Home className="w-6 h-6 text-blue-500" />
                    <Users className="w-6 h-6 text-gray-400" />
                    <BarChart3 className="w-6 h-6 text-gray-400" />
                    <Settings className="w-6 h-6 text-gray-400" />
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-blue-500 text-white rounded-xl p-6">
                      <div className="mb-2">
                        <div className="text-sm opacity-80">Total On Time</div>
                        <div className="text-3xl font-bold">32.46%</div>
                      </div>
                      <div className="text-xs">↑ 3.21% From last week</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Senior Level</div>
                        <div className="text-3xl font-bold text-gray-900">3256K</div>
                      </div>
                      <div className="text-xs text-green-500">↑ 2.31% From last week</div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-6">
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Junior Level</div>
                        <div className="text-3xl font-bold text-gray-900">3246K</div>
                      </div>
                      <div className="text-xs text-green-500">↑ 3.1% From last week</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};