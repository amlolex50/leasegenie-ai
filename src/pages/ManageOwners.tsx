
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UserRound, PencilIcon, UserPlus } from "lucide-react";

interface OwnerWithInvitation {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  invitations: {
    status: string;
  }[];
}

const ManageOwners = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          invitations!invitations_invited_by_fkey (
            status
          )
        `)
        .eq('role', 'OWNER')
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

  const handleEditOwner = (ownerId: string) => {
    navigate(`/owners/${ownerId}/edit`);
  };

  const navigateToInvite = () => {
    navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Owners</h1>
            <p className="text-gray-500">View and manage property owner information</p>
          </div>
          <Button 
            onClick={navigateToInvite}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Owner
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {owners && owners.length > 0 ? (
            owners.map((owner) => (
              <div
                key={owner.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserRound className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{owner.full_name}</h3>
                      <p className="text-gray-600">{owner.email}</p>
                      {owner.phone && (
                        <p className="text-gray-500 text-sm">{owner.phone}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditOwner(owner.id)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    owner.invitations?.[0]?.status === 'ACCEPTED' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {owner.invitations?.[0]?.status === 'ACCEPTED' ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No owners found. Invite owners from the dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageOwners;
