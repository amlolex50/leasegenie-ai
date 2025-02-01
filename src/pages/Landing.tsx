import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/landing/Navigation";
import { HeroSection } from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InfoSections from "@/components/landing/InfoSections";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-2xl overflow-hidden">
          <HeroSection />
          <InfoSections />
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
                <span className="text-xl font-semibold">LeaseGenie AI</span>
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
