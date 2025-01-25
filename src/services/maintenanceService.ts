import { supabase } from "@/integrations/supabase/client";
import { MaintenanceRequest, WorkOrder } from "@/types/maintenance";

export const maintenanceService = {
  async createMaintenanceRequest(data: Pick<MaintenanceRequest, 'description' | 'priority' | 'lease_id'>) {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { data: request, error } = await supabase
      .from('maintenance_requests')
      .insert({
        description: data.description,
        priority: data.priority,
        lease_id: data.lease_id,
        submitted_by: user.user.id,
        status: 'OPEN',
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  },

  async getMaintenanceRequests() {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        lease:leases(
          unit:units(
            property:properties(name)
          )
        )
      `);

    if (error) throw error;
    return data;
  },

  async getWorkOrders() {
    const { data, error } = await supabase
      .from('work_orders')
      .select(`
        *,
        maintenance_request:maintenance_requests(
          lease:leases(
            unit:units(
              property:properties(name)
            )
          )
        )
      `);

    if (error) throw error;
    return data;
  },

  async updateWorkOrder(id: string, data: Partial<WorkOrder>) {
    const { data: updatedOrder, error } = await supabase
      .from('work_orders')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedOrder;
  }
};