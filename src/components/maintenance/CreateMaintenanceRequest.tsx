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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the current user's lease for the selected unit
      const { data: leases, error: leaseError } = await supabase
        .from('leases')
        .select('id')
        .eq('unit_id', formData.unit)
        .single();

      if (leaseError) throw leaseError;

      // Create the maintenance request
      const { error } = await supabase
        .from('maintenance_requests')
        .insert({
          lease_id: leases.id,
          description: formData.description,
          priority: formData.priority,
          status: 'OPEN',
        });

      if (error) throw error;

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
            <Input id="attachments" name="attachments" type="file" onChange={handleFileChange} multiple />
          </div>
          <Button type="submit">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );
}