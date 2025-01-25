import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { maintenanceService } from "@/services/maintenanceService";
import { MaintenanceRequest } from "@/types/maintenance";

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
}

export function MaintenanceRequestForm({ onSuccess }: MaintenanceRequestFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Pick<MaintenanceRequest, 'description' | 'priority' | 'lease_id'>>({
    description: "",
    priority: "LOW",
    lease_id: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await maintenanceService.createMaintenanceRequest(formData);
      toast({
        title: "Success",
        description: "Maintenance request created successfully",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create maintenance request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select 
          value={formData.priority}
          onValueChange={(value: MaintenanceRequest['priority']) => 
            setFormData(prev => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Submit Request"}
      </Button>
    </form>
  );
}