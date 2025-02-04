import { OwnerInvitationForm } from "./OwnerInvitationForm";
import { OwnerInvitationList } from "./OwnerInvitationList";
import { OwnerInvitationCard } from "./OwnerInvitationCard";

export const OwnerInvitationManagement = () => {
  return (
    <div className="space-y-6">
      <OwnerInvitationCard title="Invite Owner">
        <OwnerInvitationForm />
      </OwnerInvitationCard>

      <OwnerInvitationCard title="Active Owner Invitations">
        <OwnerInvitationList />
      </OwnerInvitationCard>
    </div>
  );
};