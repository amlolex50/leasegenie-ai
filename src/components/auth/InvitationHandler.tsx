
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

  console.log('InvitationHandler state:', { loading, showPasswordChange, invitationData });

  if (loading || passwordChangeLoading) {
    return <InvitationLoading />;
  }

  if (showPasswordChange && invitationData?.email && invitationData?.temporaryPassword) {
    console.log('Showing password change form for:', invitationData.email);
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 animate-fade-in">
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
