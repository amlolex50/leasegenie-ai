import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OwnerFormFields } from "./forms/OwnerFormFields";
import { OwnerFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

interface OwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OwnerDialog = ({ open, onOpenChange }: OwnerDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<OwnerFormData>({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('owners').insert({
        ...formData,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Owner added successfully",
      });

      await queryClient.invalidateQueries({ queryKey: ['owners'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding owner:', error);
      toast({
        title: "Error",
        description: "Failed to add owner. Please try again.",
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
          <DialogTitle>Add New Owner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <OwnerFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Owner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};