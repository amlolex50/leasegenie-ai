import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InvitationListProps {
  ownerOnly?: boolean;
}

export const InvitationList = ({ ownerOnly = false }: InvitationListProps) => {
  const { toast } = useToast();
  
  const { data: invitations, refetch } = useQuery({
    queryKey: ['invitations', ownerOnly],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('invitations')
        .select('*, users!invitations_invited_by_fkey(email)')
        .eq('invited_by', user.id)
        .order('created_at', { ascending: false });

      if (ownerOnly) {
        query = query.eq('role', 'OWNER');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Invitation deleted",
        description: "The invitation has been deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!invitations?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending {ownerOnly ? "owner " : ""}invitations
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {invitation.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={invitation.status === 'PENDING' ? 'secondary' : 'default'}>
                {invitation.status}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(invitation.created_at || '').toLocaleDateString()}
            </TableCell>
            <TableCell>
              {invitation.status === 'PENDING' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(invitation.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};