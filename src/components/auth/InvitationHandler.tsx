
import { useInvitationHandler } from "./invitation/useInvitationHandler";
import { usePasswordChangeHandler } from "./invitation/usePasswordChangeHandler";
import { InvitationLoading } from "./invitation/InvitationLoading";
import { ChangeTemporaryPassword } from "./ChangeTemporaryPassword";

interface InvitationHandlerProps {
  invitationId: string;
}

export const InvitationHandler = ({ invitationId }: InvitationHandlerProps) => {
  const { loading, showPasswordChange, invitationData } = useInvitationHandler(invitationId);
  const { handlePasswordChanged } = usePasswordChangeHandler(invitationId);

  if (loading && !showPasswordChange) {
    return <InvitationLoading />;
  }

  if (showPasswordChange && invitationData) {
    return (
      <ChangeTemporaryPassword
        email={invitationData.email}
        temporaryPassword={invitationData.temporaryPassword}
        onPasswordChanged={handlePasswordChanged}
      />
    );
  }

  return null;
};
