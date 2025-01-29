import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TenantFormFields } from "./forms/TenantFormFields";
import { Tenant, TenantFormData } from "./types";
import { useQueryClient } from "@tanstack/react-query";

interface TenantUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant;
}

export const TenantUpdateDialog = ({ open, onOpenChange, tenant }: TenantUpdateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TenantFormData>({
    full_name: tenant.full_name,
    email: tenant.email,
    phone: tenant.phone || "",
    location: tenant.location || "",
    date_of_birth: tenant.date_of_birth || "",
    nationality: tenant.nationality || "",
    gender: tenant.gender || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', tenant.id)
        .eq('landlord_id', user.id)
        .eq('role', 'TENANT');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tenant updated successfully",
      });

      await queryClient.invalidateQueries({ queryKey: ['tenants'] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Error",
        description: "Failed to update tenant. Please try again.",
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
          <DialogTitle>Update Tenant Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <TenantFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="hover:scale-105 transition-transform"
            >
              {isLoading ? "Updating..." : "Update Tenant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};