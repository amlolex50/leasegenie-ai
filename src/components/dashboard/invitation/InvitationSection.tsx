import { InvitationManagement } from "../InvitationManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const InvitationSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Invitation Management</h2>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Invitations</TabsTrigger>
          <TabsTrigger value="owners">Owner Invitations</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <InvitationManagement />
        </TabsContent>
        <TabsContent value="owners">
          <InvitationManagement ownerOnly />
        </TabsContent>
      </Tabs>
    </div>
  );
};