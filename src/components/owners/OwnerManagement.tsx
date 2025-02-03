import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, Building2, UserPlus } from "lucide-react";
import { OwnerList } from "./OwnerList";
import { OwnerDialog } from "./OwnerDialog";
import { useToast } from "@/components/ui/use-toast";

export const OwnerManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const { data: owners, isLoading, error } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owners')
        .select('*');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load owners. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    }
  });

  const filteredOwners = owners?.filter(owner => 
    owner.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Failed to load owners. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Manage Property Owners</h1>
          <p className="text-muted-foreground mt-2">View and manage property owners</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Owner
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Filter by Company
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <OwnerList owners={filteredOwners || []} />
      )}

      <OwnerDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};