import { InvitationForm } from "./invitation/InvitationForm";
import { InvitationList } from "./invitation/InvitationList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InvitationManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <InvitationForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <InvitationList />
        </CardContent>
      </Card>
    </div>
  );
};