import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Wrench, ListChecks } from "lucide-react";

interface ContractorInfoCardProps {
  contractor: {
    email: string;
    location: string | null;
    speciality: string | null;
    skills: string[];
  };
}

export const ContractorInfoCard = ({ contractor }: ContractorInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contractor Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{contractor.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{contractor.location || 'Location not specified'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span>{contractor.speciality || 'Speciality not specified'}</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contractor.skills && contractor.skills.length > 0 ? (
                contractor.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">No skills specified</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};