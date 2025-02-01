import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/how-it-works/Navigation";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Property Manager",
    company: "Urban Living Properties",
    content: "This platform has revolutionized how we handle property management. The automated maintenance requests and contractor assignments have saved us countless hours.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Landlord",
    company: "MCR Holdings",
    content: "The AI-powered insights have helped me make better decisions about my properties. The lease management system is incredibly intuitive and efficient.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Real Estate Investor",
    company: "Rodriguez Investments",
    content: "I've been able to scale my property portfolio significantly thanks to the streamlined processes this platform provides. The automated reports are a game-changer.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  }
];

const Testimonials = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our property management platform is helping landlords and property managers streamline their operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;