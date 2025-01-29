import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractorFormFields } from "./forms/ContractorFormFields";
import { ContractorFormData } from "./types";

interface ContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContractorDialog = ({ open, onOpenChange }: ContractorDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContractorFormData>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    speciality: "",
    skills: "",
    hourly_rate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from('users').insert({
        ...formData,
        role: 'CONTRACTOR',
        skills: formData.skills.split(',').map(skill => skill.trim()),
        hourly_rate: parseFloat(formData.hourly_rate),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contractor added successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error adding contractor:', error);
      toast({
        title: "Error",
        description: "Failed to add contractor. Please try again.",
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
          <DialogTitle>Add New Contractor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ContractorFormFields formData={formData} setFormData={setFormData} />
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Contractor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};