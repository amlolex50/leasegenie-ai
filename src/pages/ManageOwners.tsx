import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { OwnerInvitationManagement } from "@/components/owners/invitation/OwnerInvitationManagement";

interface OwnerWithInvitation {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  users: {
    invitations: {
      status: string;
    }[];
  }[];
}

const ManageOwners = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: owners } = useQuery<OwnerWithInvitation[]>({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('owners')
        .select(`
          *,
          users (
            invitations!invitations_invited_by_fkey (
              status
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load owners. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
      return data || [];
    }
  });

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Owners</h1>
            <p className="text-gray-500">View and manage property owners</p>
          </div>
          <Button
            onClick={() => navigate('/owners/create')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Owner
          </Button>
        </div>

        <div className="space-y-8">
          <OwnerInvitationManagement />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : owners && owners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg">{owner.full_name}</h3>
                  <p className="text-gray-600">{owner.email}</p>
                  {owner.phone && (
                    <p className="text-gray-500 text-sm">{owner.phone}</p>
                  )}
                  {owner.company_name && (
                    <p className="text-gray-500 text-sm mt-1">{owner.company_name}</p>
                  )}
                  <div className="mt-2">
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      owner.users?.[0]?.invitations?.[0]?.status === 'ACCEPTED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {owner.users?.[0]?.invitations?.[0]?.status === 'ACCEPTED' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No owners found. Add your first owner to get started.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageOwners;