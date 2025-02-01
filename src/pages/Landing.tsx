import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InfoSections from "@/components/landing/InfoSections";
import { useNavigate, Link } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation - Moved to top and made sticky */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-sm px-8 py-4 shadow-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Hero Section */}
          <div className="px-8 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Your Intelligent Partner For<br />
                <span className="text-blue-500">Commercial Lease Management</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Empowering commercial landlords and property managers with AI-driven lease management, predictive maintenance, and automated support.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full px-8"
                  onClick={() => navigate('/auth')}
                >
                  Learn More
                </Button>
                <Button 
                  className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-8"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-5xl mb-32">
              <div className="bg-[#D3E4FD] rounded-xl shadow-sm p-8 text-left">
                <div className="bg-white rounded-2xl overflow-hidden">
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
                      <button className="p-2 rounded-lg hover:bg-gray-50">
                        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </button>
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="bg-blue-600 rounded-xl p-6 text-white">
                        <div className="mb-2">
                          <div className="text-sm opacity-80">Total Compliance</div>
                          <div className="text-3xl font-bold">32.46%</div>
                        </div>
                        <div className="text-xs opacity-70">↑ 3.21% From last month</div>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="mb-2">
                          <div className="text-sm text-gray-600">Active Leases</div>
                          <div className="text-3xl font-bold">3256K</div>
                        </div>
                        <div className="text-xs text-green-500">↑ 2.31% From last month</div>
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="mb-2">
                          <div className="text-sm text-gray-600">Total Properties</div>
                          <div className="text-3xl font-bold">3246K</div>
                        </div>
                        <div className="text-xs text-green-500">↑ 3.1% From last month</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-8 bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-semibold">Selected Properties</h3>
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md">Monthly View</button>
                            <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md">Annual View</button>
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
                          <div className="flex justify-between mt-4 text-sm text-gray-600">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                              <span key={month}>{month}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-6">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <InfoSections />

          {/* Features Section */}
          <FeaturesSection />

          {/* Testimonials */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "LeaseGenie AI has revolutionized how we manage our commercial properties. It's like having a team of experts working 24/7.",
                  author: "Sarah Johnson",
                  role: "Property Manager, NYC"
                },
                {
                  quote: "The predictive maintenance feature alone has saved us thousands in potential repairs. This platform is a game-changer.",
                  author: "Michael Chen",
                  role: "Commercial Landlord, San Francisco"
                },
                {
                  quote: "As a tenant, I appreciate the transparency and ease of communication. It's made our lease management so much smoother.",
                  author: "Emily Rodriguez",
                  role: "Retail Store Owner, Chicago"
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                      </div>
                      <div className="flex items-center mt-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <span className="text-primary font-bold text-lg">{testimonial.author[0]}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                {
                  title: "Product",
                  links: ["Features", "Pricing", "Case Studies", "FAQ"]
                },
                {
                  title: "Company",
                  links: ["About", "Careers", "Contact", "Partners"]
                },
                {
                  title: "Resources",
                  links: ["Blog", "Webinars", "Documentation", "Support"]
                },
                {
                  title: "Legal",
                  links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"]
                }
              ].map((section, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center">
                <span className="text-primary text-2xl mr-2">★</span>
                <span className="text-xl font-semibold">ManageLeaseAi</span>
              </div>
              <p className="mt-4 md:mt-0 text-base text-gray-400">
                &copy; {new Date().getFullYear()} LeaseGenie AI. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}