import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
            <div className="bg-[#D3E4FD] rounded-xl p-4 sm:p-6 lg:p-8">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
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
                        className="pl-8 pr-4 py-2 rounded-lg bg-gray-50 text-sm w-full sm:w-64 border border-gray-200"
                      />
                      <svg
                        className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-50">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-600 text-white rounded-xl p-4 sm:p-6">
                      <div className="mb-2">
                        <div className="text-sm opacity-80">Total Compliance</div>
                        <div className="text-2xl sm:text-3xl font-bold">32.46%</div>
                      </div>
                      <div className="text-xs opacity-70">↑ 3.21% From last month</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Active Leases</div>
                        <div className="text-2xl sm:text-3xl font-bold">3256K</div>
                      </div>
                      <div className="text-xs text-green-500">↑ 2.31% From last month</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                      <div className="mb-2">
                        <div className="text-sm text-gray-600">Total Properties</div>
                        <div className="text-2xl sm:text-3xl font-bold">3246K</div>
                      </div>
                      <div className="text-xs text-green-500">↑ 3.1% From last month</div>
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