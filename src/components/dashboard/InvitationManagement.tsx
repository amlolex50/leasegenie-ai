
import { InvitationForm } from "./invitation/InvitationForm";
import { InvitationList } from "./invitation/InvitationList";
import { InvitationCard } from "./invitation/InvitationCard";

export const InvitationManagement = () => {
  return (
    <div className="space-y-6">
      <InvitationCard title="Invite Users">
        <InvitationForm />
      </InvitationCard>

      <InvitationCard title="Active Invitations">
        <InvitationList />
      </InvitationCard>
    </div>
  );
};
