import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

interface PersonalInfoCardProps {
  email: string;
  phone: string | null;
  location: string | null;
}

export const PersonalInfoCard = ({ email, phone, location }: PersonalInfoCardProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-900">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p>{phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p>{location || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};