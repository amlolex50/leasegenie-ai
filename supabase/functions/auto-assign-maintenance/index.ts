import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/config.ts';
import { MaintenanceRequest, Contractor } from './types.ts';
import { analyzeRequest, selectBestContractor } from './services/ai.ts';
import { sendSMS, createAssignmentMessage, createLandlordNotificationMessage } from './services/notifications.ts';
import { createWorkOrder } from './services/workOrders.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { maintenanceRequestId } = await req.json();

    // Fetch maintenance request details with property location and owner info
    const { data: request, error: requestError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        lease:leases (
          tenant_id,
          unit:units (
            property:properties (
              owner_id,
              location,
              name,
              owner:users (
                phone
              )
            )
          )
        )
      `)
      .eq('id', maintenanceRequestId)
      .single();

    if (requestError || !request) {
      throw new Error('Failed to fetch maintenance request');
    }

    console.log('Analyzing maintenance request...');
    const analysis = await analyzeRequest(request.description);
    
    console.log('Fetching available contractors...');
    const { data: contractors, error: contractorsError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'CONTRACTOR')
      .eq('landlord_id', request.lease.unit.property.owner_id)
      .eq('availability_status', 'AVAILABLE');

    if (contractorsError || !contractors) {
      throw new Error('Failed to fetch contractors');
    }

    const { data: workOrders } = await supabase
      .from('work_orders')
      .select('contractor_id, status')
      .in('status', ['ASSIGNED', 'IN_PROGRESS']);

    console.log('Selecting best contractor using LLM...');
    const { contractor: bestContractor, reasoning } = await selectBestContractor(
      contractors,
      analysis,
      workOrders || [],
      request.lease.unit.property.location
    );

    console.log('Creating work order...');
    const success = await createWorkOrder(
      maintenanceRequestId,
      bestContractor.id,
      analysis.urgency,
      reasoning
    );

    if (!success) {
      throw new Error('Failed to create work order');
    }

    // Send SMS notification to the contractor
    if (bestContractor.phone) {
      const contractorMessage = createAssignmentMessage(
        bestContractor,
        request.lease.unit.property.name,
        analysis.category,
        analysis.urgency,
        reasoning
      );
      
      console.log('Sending SMS notification to contractor...');
      await sendSMS(bestContractor.phone, contractorMessage);
    }

    // Send SMS notification to the landlord
    const landlordPhone = request.lease.unit.property.owner.phone;
    if (landlordPhone) {
      const landlordMessage = createLandlordNotificationMessage(
        bestContractor,
        request.lease.unit.property.name,
        analysis.category,
        analysis.urgency,
        reasoning
      );
      
      console.log('Sending SMS notification to landlord...');
      await sendSMS(landlordPhone, landlordMessage);
    }

    return new Response(
      JSON.stringify({
        success: true,
        contractor: bestContractor,
        analysis: analysis,
        reasoning: reasoning
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-assign-maintenance:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
