import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TenantFormFields } from "./forms/TenantFormFields";
import { TenantFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

interface TenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TenantDialog = ({ open, onOpenChange }: TenantDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TenantFormData>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from('users').insert({
        ...formData,
        role: 'TENANT',
        landlord_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant added successfully",
      });

      await queryClient.invalidateQueries({ queryKey: ['tenants'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast({
        title: "Error",
        description: "Failed to add tenant. Please try again.",
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
          <DialogTitle>Add New Tenant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TenantFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};