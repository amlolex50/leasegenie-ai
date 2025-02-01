import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-8 py-8 md:py-16">
      <div className="text-center mb-8 md:mb-16">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
          Your Intelligent Partner For{' '}
          <span className="text-blue-500">Commercial Lease Management</span>
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          Empowering commercial landlords and property managers with AI-driven lease management, predictive maintenance, and automated support.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            variant="outline" 
            className="rounded-full px-8 w-full sm:w-auto"
            onClick={() => navigate('/auth')}
          >
            Learn More
          </Button>
          <Button 
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8 w-full sm:w-auto"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
      </div>
      <DashboardPreview />
    </div>
  );
};

const DashboardPreview = () => (
  <div className="relative mx-auto max-w-5xl mb-8 md:mb-16">
    <div className="bg-[#D3E4FD] rounded-xl shadow-sm p-4 md:p-8 text-left">
      <div className="bg-white rounded-2xl overflow-hidden">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  </div>
);

const DashboardHeader = () => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4">
    <div className="flex items-center gap-4 mb-4 sm:mb-0">
      <span className="text-blue-500 text-2xl">★</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Home / Dashboard</span>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <SearchBar />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <Avatar />
      </div>
    </div>
  </div>
);

const SearchBar = () => (
  <div className="relative w-full sm:w-64">
    <input
      type="text"
      placeholder="Search..."
      className="pl-8 pr-4 py-2 rounded-lg bg-gray-50 text-sm w-full border border-gray-200"
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
);

const ThemeToggle = () => (
  <button className="p-2 rounded-lg hover:bg-gray-50">
    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  </button>
);

const NotificationBell = () => (
  <button className="p-2 rounded-lg hover:bg-gray-50">
    <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  </button>
);

const Avatar = () => (
  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
);

const DashboardContent = () => (
  <div className="p-4 md:p-6">
    <StatisticsGrid />
    <ChartsGrid />
  </div>
);

const StatisticsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
    <StatCard
      color="blue-600"
      label="Total Compliance"
      value="32.46%"
      trend="↑ 3.21% From last month"
      isMain
    />
    <StatCard
      label="Active Leases"
      value="3256K"
      trend="↑ 2.31% From last month"
    />
    <StatCard
      label="Total Properties"
      value="3246K"
      trend="↑ 3.1% From last month"
    />
  </div>
);

interface StatCardProps {
  color?: string;
  label: string;
  value: string;
  trend: string;
  isMain?: boolean;
}

const StatCard = ({ color, label, value, trend, isMain }: StatCardProps) => (
  <div className={`${isMain ? `bg-${color}` : 'bg-white border border-gray-200'} rounded-xl p-6 ${isMain ? 'text-white' : ''}`}>
    <div className="mb-2">
      <div className={`text-sm ${isMain ? 'opacity-80' : 'text-gray-600'}`}>{label}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
    <div className={`text-xs ${isMain ? 'opacity-70' : 'text-green-500'}`}>{trend}</div>
  </div>
);

const ChartsGrid = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
    <MonthlyChart />
    <TopProperties />
  </div>
);

const MonthlyChart = () => (
  <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-gray-200 p-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <h3 className="font-semibold mb-2 sm:mb-0">Selected Properties</h3>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md w-full sm:w-auto">Monthly View</button>
        <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md w-full sm:w-auto">Annual View</button>
      </div>
    </div>
    <div className="h-64">
      <div className="h-full flex items-end space-x-2">
        {[40, 30, 25, 35, 45, 35, 40, 45, 35, 40, 35, 40].map((height, i) => (
          <div
            key={i}
            className="w-full bg-blue-500 rounded-t"
            style={{ height: `${height}%` }}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-4 text-sm text-gray-600 overflow-x-auto">
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
          <span key={month} className="whitespace-nowrap">{month}</span>
        ))}
      </div>
    </div>
  </div>
);

const TopProperties = () => (
  <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="font-semibold mb-4">Top Properties</h3>
    <div className="space-y-4">
      {[1, 2, 3].map((num) => (
        <div key={num} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100"></div>
            <div>
              <div className="font-medium">Property {num}</div>
              <div className="text-sm text-gray-500">2020 - Present</div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </div>
);