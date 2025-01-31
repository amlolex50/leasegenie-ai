import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function createWorkOrder(
  maintenanceRequestId: string,
  contractorId: string,
  urgency: number,
  reasoning: string
): Promise<boolean> {
  const estimatedDays = urgency === 5 ? 1 : urgency === 4 ? 2 : urgency === 3 ? 5 : 7;
  const estimatedCompletion = new Date();
  estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays);

  const { error: workOrderError } = await supabase
    .from('work_orders')
    .insert({
      maintenance_request_id: maintenanceRequestId,
      contractor_id: contractorId,
      status: 'ASSIGNED',
      estimated_completion: estimatedCompletion.toISOString(),
      notes: `AI Assignment Reasoning: ${reasoning}`
    });

  if (workOrderError) {
    console.error('Error creating work order:', workOrderError);
    return false;
  }

  const { error: updateError } = await supabase
    .from('maintenance_requests')
    .update({ status: 'IN_PROGRESS' })
    .eq('id', maintenanceRequestId);

  if (updateError) {
    console.error('Error updating maintenance request:', updateError);
    return false;
  }

  return true;
}