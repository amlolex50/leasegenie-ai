import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InfoSections from "@/components/landing/InfoSections";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Navigation */}
          <nav className="flex items-center justify-between px-8 py-4 shadow-md rounded-[20px] relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">★</span>
              <span className="font-semibold text-xl">LeaseGenie AI</span>
            </div>
            <div className="hidden md:flex items-center gap-12">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Feature</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">How It Work</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About Us</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Testimonial</a>
            </div>
            <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-6">Get in Touch</Button>
          </nav>

          {/* Hero Section */}
          <div className="px-8 py-16">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Your Intelligent Partner For<br />
                <span className="text-primary">Commercial Lease Management</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Empowering commercial landlords and property managers with AI-driven lease management, predictive maintenance, and automated support.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="rounded-full px-8">Learn More</Button>
                <Button className="bg-primary text-white hover:bg-primary/90 rounded-full px-8">Get Started</Button>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-5xl mb-32">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Dashboard Preview Content */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-4">
                      <span className="text-primary text-2xl">★</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-gray-100"></div>
                        <span className="text-sm text-gray-600">Home / Dashboard</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <input type="text" placeholder="Search..." className="pl-8 pr-4 py-2 rounded-lg bg-gray-50 text-sm w-64" />
                        <svg className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    </div>
                  </div>

                  {/* Dashboard Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="bg-primary rounded-xl p-6 text-white">
                        <div className="mb-2">
                          <div className="text-sm opacity-80">Total Compliance</div>
                          <div className="text-3xl font-bold">32.46%</div>
                        </div>
                        <div className="text-xs opacity-70">↑ 3.21% From last month</div>
                      </div>
                      <div className="bg-white border rounded-xl p-6">
                        <div className="mb-2">
                          <div className="text-sm text-gray-600">Active Leases</div>
                          <div className="text-3xl font-bold">3256K</div>
                        </div>
                        <div className="text-xs text-green-500">↑ 2.31% From last month</div>
                      </div>
                      <div className="bg-white border rounded-xl p-6">
                        <div className="mb-2">
                          <div className="text-sm text-gray-600">Total Properties</div>
                          <div className="text-3xl font-bold">3246K</div>
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
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
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
              <span className="text-xl font-semibold">LeaseGenie AI</span>
            </div>
            <p className="mt-4 md:mt-0 text-base text-gray-400">
              &copy; {new Date().getFullYear()} LeaseGenie AI. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}