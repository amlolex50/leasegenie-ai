import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractorFormFields } from "./forms/ContractorFormFields";
import { Contractor, ContractorFormData } from "./types";

interface ContractorUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: Contractor;
}

export const ContractorUpdateDialog = ({ open, onOpenChange, contractor }: ContractorUpdateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContractorFormData>({
    full_name: contractor.full_name,
    email: contractor.email,
    phone: contractor.phone || "",
    location: contractor.location || "",
    speciality: contractor.speciality || "",
    skills: contractor.skills.join(", "),
    hourly_rate: contractor.hourly_rate?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          ...formData,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          hourly_rate: parseFloat(formData.hourly_rate),
        })
        .eq('id', contractor.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contractor updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error updating contractor:', error);
      toast({
        title: "Error",
        description: "Failed to update contractor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader>
          <DialogTitle>Update Contractor Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContractorFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Contractor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};