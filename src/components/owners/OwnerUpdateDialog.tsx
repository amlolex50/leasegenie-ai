import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OwnerFormFields } from "./forms/OwnerFormFields";
import { Owner, OwnerFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

interface OwnerUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner: Owner;
}

export const OwnerUpdateDialog = ({ open, onOpenChange, owner }: OwnerUpdateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<OwnerFormData>({
    full_name: owner.full_name,
    email: owner.email,
    phone: owner.phone || "",
    company_name: owner.company_name || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('owners')
        .update({
          ...formData,
        })
        .eq('id', owner.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Owner updated successfully",
      });

      await queryClient.invalidateQueries({ queryKey: ['owners'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating owner:', error);
      toast({
        title: "Error",
        description: "Failed to update owner. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Owner Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <OwnerFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Owner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};