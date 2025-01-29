import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContractorUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractor: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    location: string | null;
    speciality: string | null;
    skills: string[];
    hourly_rate: number | null;
  };
}

export const ContractorUpdateDialog = ({ open, onOpenChange, contractor }: ContractorUpdateDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="speciality">Speciality</Label>
            <Input
              id="speciality"
              value={formData.speciality}
              onChange={(e) => setFormData(prev => ({ ...prev, speciality: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="e.g. Plumbing, Electrical, HVAC"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
            />
          </div>
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