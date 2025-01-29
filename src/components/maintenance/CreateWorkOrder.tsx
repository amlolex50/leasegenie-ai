import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const CreateWorkOrder = () => {
  const [formData, setFormData] = useState({
    maintenance_request_id: "",
    contractor_id: "",
    estimated_completion: "",
    notes: "",
  });

  const { data: maintenanceRequests } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', user.id);

      if (!properties?.length) return [];

      const { data } = await supabase
        .from('maintenance_requests')
        .select(`
          id,
          description,
          status,
          lease:leases (
            unit:units (
              property_id
            )
          )
        `)
        .eq('status', 'OPEN');

      return data?.filter(request => 
        properties.some(prop => prop.id === request.lease.unit.property_id)
      ) || [];
    }
  });

  const { data: contractors } = useQuery({
    queryKey: ['contractors'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('role', 'CONTRACTOR')
        .eq('landlord_id', user.id);

      return data || [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('work_orders')
        .insert([{
          ...formData,
          status: 'ASSIGNED',
          estimated_completion: formData.estimated_completion || null,
        }]);

      if (error) throw error;

      // Update maintenance request status
      await supabase
        .from('maintenance_requests')
        .update({ status: 'IN_PROGRESS' })
        .eq('id', formData.maintenance_request_id);

      toast.success("Work order created successfully");
      setFormData({
        maintenance_request_id: "",
        contractor_id: "",
        estimated_completion: "",
        notes: "",
      });
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error("Failed to create work order");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="maintenance_request">Maintenance Request</Label>
        <Select
          value={formData.maintenance_request_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_request_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a maintenance request" />
          </SelectTrigger>
          <SelectContent>
            {maintenanceRequests?.map((request) => (
              <SelectItem key={request.id} value={request.id}>
                {request.description.substring(0, 50)}...
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractor">Assign Contractor</Label>
        <Select
          value={formData.contractor_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, contractor_id: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a contractor" />
          </SelectTrigger>
          <SelectContent>
            {contractors?.map((contractor) => (
              <SelectItem key={contractor.id} value={contractor.id}>
                {contractor.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="estimated_completion">Estimated Completion Date</Label>
        <Input
          id="estimated_completion"
          type="date"
          value={formData.estimated_completion}
          onChange={(e) => setFormData(prev => ({ ...prev, estimated_completion: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any additional notes or instructions..."
        />
      </div>

      <Button type="submit" className="w-full">Create Work Order</Button>
    </form>
  );
};