import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Wrench, DollarSign, Star } from "lucide-react";
import { Contractor } from "../types";

interface ContractorCardProps {
  contractor: Contractor;
  onEdit: (contractor: Contractor) => void;
}

export const ContractorCard = ({ contractor, onEdit }: ContractorCardProps) => {
  return (
    <Card key={contractor.id} className="p-6 space-y-4 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{contractor.full_name}</h3>
          <p className="text-sm text-muted-foreground">{contractor.email}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit(contractor)}
          className="hover:scale-105 transition-transform"
        >
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
  );
};