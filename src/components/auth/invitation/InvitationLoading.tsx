
import { Loader2 } from "lucide-react";

export const InvitationLoading = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-gray-600">Setting up your account...</p>
    </div>
  );
};
