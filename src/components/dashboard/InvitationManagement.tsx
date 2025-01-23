import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, X } from "lucide-react";

export const InvitationManagement = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: invitations, refetch } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      console.log('Fetching invitations...');
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }
      console.log('Fetched invitations:', data);
      return data;
    }
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      console.log('Current user:', user);

      console.log('Creating invitation...');
      const { error } = await supabase
        .from('invitations')
        .insert([
          {
            email,
            role: 'TENANT',
            invited_by: user.id,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${email}`,
      });

      setEmail("");
      refetch();
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting invitation:', id);
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
      console.error('Error deleting invitation:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
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
        </CardContent>
      </Card>
    </div>
  );
};