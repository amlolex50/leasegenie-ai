
import { useInvitationHandler } from "./invitation/useInvitationHandler";
import { usePasswordChangeHandler } from "./invitation/usePasswordChangeHandler";
import { InvitationLoading } from "./invitation/InvitationLoading";
import { ChangeTemporaryPassword } from "./ChangeTemporaryPassword";

interface InvitationHandlerProps {
  invitationId: string;
}

export const InvitationHandler = ({ invitationId }: InvitationHandlerProps) => {
  const { loading, showPasswordChange, invitationData } = useInvitationHandler(invitationId);
  const { loading: passwordChangeLoading, handlePasswordChanged } = usePasswordChangeHandler(invitationId);

  if (loading || passwordChangeLoading) {
    return <InvitationLoading />;
  }

  if (showPasswordChange && invitationData) {
    return (
      <div className="animate-fade-in">
        <ChangeTemporaryPassword
          email={invitationData.email}
          temporaryPassword={invitationData.temporaryPassword}
          onPasswordChanged={handlePasswordChanged}
        />
      </div>
    );
  }

  return null;
};
