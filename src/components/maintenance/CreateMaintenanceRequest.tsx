import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function CreateMaintenanceRequest() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issue: "",
    property: "",
    unit: "",
    priority: "",
    description: "",
    attachments: null as File[] | null,
  });

  // Fetch properties for the current user
  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  // Fetch units for selected property
  const { data: units } = useQuery({
    queryKey: ['units', formData.property],
    queryFn: async () => {
      if (!formData.property) return [];
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', formData.property);
      if (error) throw error;
      return data;
    },
    enabled: !!formData.property,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, attachments: Array.from(e.target.files as FileList) }));
    }
  };

  const validateForm = () => {
    if (!formData.issue.trim()) {
      toast({ title: "Error", description: "Please enter an issue", variant: "destructive" });
      return false;
    }
    if (!formData.property) {
      toast({ title: "Error", description: "Please select a property", variant: "destructive" });
      return false;
    }
    if (!formData.unit) {
      toast({ title: "Error", description: "Please select a unit", variant: "destructive" });
      return false;
    }
    if (!formData.priority) {
      toast({ title: "Error", description: "Please select a priority", variant: "destructive" });
      return false;
    }
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Please enter a description", variant: "destructive" });
      return false;
    }
    return true;
  };

  const uploadFiles = async (maintenanceId: string): Promise<string[]> => {
    if (!formData.attachments?.length) return [];

    const uploadPromises = formData.attachments.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${maintenanceId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('maintenance_documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('maintenance_documents')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Get the current user's lease for the selected unit
      const { data: lease, error: leaseError } = await supabase
        .from('leases')
        .select('id')
        .eq('unit_id', formData.unit)
        .maybeSingle();

      if (leaseError) throw leaseError;
      
      if (!lease) {
        toast({ 
          title: "Error", 
          description: "No active lease found for this unit. Please contact your property manager.", 
          variant: "destructive" 
        });
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error('User not found');

      // Create the maintenance request
      const { data: maintenanceRequest, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .insert({
          lease_id: lease.id,
          description: formData.description,
          priority: formData.priority,
          status: 'OPEN',
          submitted_by: user.id
        })
        .select()
        .single();

      if (maintenanceError) throw maintenanceError;

      // Upload files if any
      if (formData.attachments?.length) {
        const fileUrls = await uploadFiles(maintenanceRequest.id);
        
        // Update maintenance request with document URLs
        const { error: updateError } = await supabase
          .from('maintenance_requests')
          .update({ document_url: fileUrls.join(',') })
          .eq('id', maintenanceRequest.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });

      // Reset form
      setFormData({
        issue: "",
        property: "",
        unit: "",
        priority: "",
        description: "",
        attachments: null,
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Maintenance Request</CardTitle>
        <CardDescription>Submit a new maintenance request for your property.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="issue">Issue</Label>
            <Input id="issue" name="issue" value={formData.issue} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="property">Property</Label>
            <Select name="property" value={formData.property} onValueChange={handleSelectChange("property")}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select name="unit" value={formData.unit} onValueChange={handleSelectChange("unit")}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units?.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" value={formData.priority} onValueChange={handleSelectChange("priority")}>
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
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="attachments">Attachments</Label>
            <Input 
              id="attachments" 
              name="attachments" 
              type="file" 
              onChange={handleFileChange} 
              multiple 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}