import { InvitationForm } from "./InvitationForm";
import { InvitationList } from "./InvitationList";
import { InvitationCard } from "./InvitationCard";

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