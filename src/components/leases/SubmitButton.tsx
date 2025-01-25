import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isLoading: boolean;
  isEdit?: boolean;
}

export const SubmitButton = ({ isLoading, isEdit }: SubmitButtonProps) => {
  return (
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEdit ? 'Updating' : 'Creating'} Lease...
        </>
      ) : (
        isEdit ? 'Update Lease' : 'Create Lease'
      )}
    </Button>
  );
};