import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Wrench, DollarSign, Star } from "lucide-react";

interface Contractor {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  speciality: string | null;
  skills: string[];
  hourly_rate: number | null;
  availability_status: string;
  rating: number;
}

interface ContractorListProps {
  contractors: Contractor[];
}

export const ContractorList = ({ contractors }: ContractorListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contractors.map((contractor) => (
        <Card key={contractor.id} className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{contractor.full_name}</h3>
              <p className="text-sm text-muted-foreground">{contractor.email}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {contractor.location || "Location not set"}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{contractor.speciality || "Speciality not set"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contractor.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{contractor.hourly_rate ? `$${contractor.hourly_rate}/hr` : "Rate not set"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{contractor.rating || 0}</span>
            </div>
          </div>

          <Badge 
            variant={contractor.availability_status === "AVAILABLE" ? "success" : "secondary"}
            className="mt-2"
          >
            {contractor.availability_status}
          </Badge>
        </Card>
      ))}
    </div>
  );
};