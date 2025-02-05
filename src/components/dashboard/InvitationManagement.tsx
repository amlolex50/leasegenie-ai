import { InvitationForm } from "./invitation/InvitationForm";
import { InvitationList } from "./invitation/InvitationList";
import { InvitationCard } from "./invitation/InvitationCard";

interface InvitationManagementProps {
  ownerOnly?: boolean;
}

export const InvitationManagement = ({ ownerOnly = false }: InvitationManagementProps) => {
  return (
    <div className="space-y-6">
      <InvitationCard title={ownerOnly ? "Invite Owner" : "Send Invitation"}>
        <InvitationForm ownerOnly={ownerOnly} />
      </InvitationCard>

      <InvitationCard title={ownerOnly ? "Active Owner Invitations" : "Active Invitations"}>
        <InvitationList ownerOnly={ownerOnly} />
      </InvitationCard>
    </div>
  );
};