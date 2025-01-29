import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, MapPin, UserPlus } from "lucide-react";
import { ContractorList } from "./ContractorList";
import { ContractorDialog } from "./ContractorDialog";
import { useToast } from "@/components/ui/use-toast";

export const ContractorManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const { data: contractors, isLoading, error } = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'CONTRACTOR')
        .eq('landlord_id', user.id);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load contractors. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const filteredContractors = contractors?.filter(contractor => 
    contractor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.speciality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load contractors. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Manage Contractors</h1>
          <p className="text-muted-foreground mt-2">View and manage your contractor network</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Contractor
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, location, or speciality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Filter by Location
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <ContractorList contractors={filteredContractors || []} />
      )}

      <ContractorDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};