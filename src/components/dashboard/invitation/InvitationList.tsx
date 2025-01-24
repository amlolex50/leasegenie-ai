import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const InvitationList = () => {
  const { toast } = useToast();
  
  const { data: invitations, refetch } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('invitations')
        .select('*, users!invitations_invited_by_fkey(email)')
        .order('created_at', { ascending: false });
      
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
        {invitations?.map((invitation) => (
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