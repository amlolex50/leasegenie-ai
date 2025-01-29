import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface TenantHeaderProps {
  fullName: string;
}

export const TenantHeader = ({ fullName }: TenantHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Welcome Back, {fullName}</h1>
        <p className="text-muted-foreground mt-2">Manage your leases and maintenance requests</p>
      </div>
      <Button variant="outline" className="hover:bg-blue-50">
        <User className="mr-2 h-4 w-4" />
        View Profile
      </Button>
    </div>
  );
};