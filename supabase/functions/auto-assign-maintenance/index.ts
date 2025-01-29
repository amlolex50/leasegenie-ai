import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

interface MaintenanceRequest {
  id: string
  description: string
  priority: string
  lease_id: string
  submitted_by: string
}

interface Contractor {
  id: string
  full_name: string
  skills: string[]
  location: string
  availability_status: string
  landlord_id: string
}

async function analyzeRequest(description: string): Promise<{ 
  category: string, 
  required_skills: string[], 
  urgency: number 
}> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a maintenance request analyzer. Analyze the maintenance request and return:
          1. The category of the issue (plumbing, electrical, HVAC, etc.)
          2. Required skills to fix the issue
          3. Urgency level (1-5, where 5 is most urgent)
          Return the analysis in JSON format with keys: category, required_skills (array), urgency (number)`
        },
        {
          role: 'user',
          content: description
        }
      ]
    })
  })

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

async function findBestContractor(
  landlordId: string, 
  analysis: { category: string, required_skills: string[], urgency: number },
  location: string
): Promise<Contractor | null> {
  // Get all available contractors for this landlord
  const { data: contractors, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'CONTRACTOR')
    .eq('landlord_id', landlordId)
    .eq('availability_status', 'AVAILABLE')

  if (error || !contractors) {
    console.error('Error fetching contractors:', error)
    return null
  }

  // Get current work orders for workload analysis
  const { data: workOrders } = await supabase
    .from('work_orders')
    .select('contractor_id, status')
    .in('status', ['ASSIGNED', 'IN_PROGRESS'])

  // Score each contractor based on multiple factors
  const scoredContractors = contractors.map(contractor => {
    let score = 0

    // Skills match
    const skillsMatch = analysis.required_skills.filter(
      skill => contractor.skills?.includes(skill)
    ).length
    score += skillsMatch * 2

    // Location match (simple string match for now)
    if (contractor.location === location) {
      score += 3
    }

    // Workload (fewer open orders = higher score)
    const openOrders = workOrders?.filter(
      wo => wo.contractor_id === contractor.id
    ).length || 0
    score -= openOrders

    return { contractor, score }
  })

  // Sort by score and return the best match
  const bestMatch = scoredContractors.sort((a, b) => b.score - a.score)[0]
  return bestMatch?.contractor || null
}

async function createWorkOrder(
  maintenanceRequestId: string,
  contractorId: string,
  urgency: number
): Promise<boolean> {
  const estimatedDays = urgency === 5 ? 1 : urgency === 4 ? 2 : urgency === 3 ? 5 : 7
  const estimatedCompletion = new Date()
  estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedDays)

  const { error: workOrderError } = await supabase
    .from('work_orders')
    .insert({
      maintenance_request_id: maintenanceRequestId,
      contractor_id: contractorId,
      status: 'ASSIGNED',
      estimated_completion: estimatedCompletion.toISOString()
    })

  if (workOrderError) {
    console.error('Error creating work order:', workOrderError)
    return false
  }

  // Update maintenance request status
  const { error: updateError } = await supabase
    .from('maintenance_requests')
    .update({ status: 'IN_PROGRESS' })
    .eq('id', maintenanceRequestId)

  if (updateError) {
    console.error('Error updating maintenance request:', updateError)
    return false
  }

  return true
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { maintenanceRequestId } = await req.json()

    // Fetch maintenance request details
    const { data: request, error: requestError } = await supabase
      .from('maintenance_requests')
      .select(`
        *,
        lease:leases (
          tenant_id,
          unit:units (
            property:properties (
              owner_id,
              location
            )
          )
        )
      `)
      .eq('id', maintenanceRequestId)
      .single()

    if (requestError || !request) {
      throw new Error('Failed to fetch maintenance request')
    }

    // Analyze the request using GPT-4
    console.log('Analyzing maintenance request...')
    const analysis = await analyzeRequest(request.description)
    
    // Find the best contractor
    console.log('Finding best contractor...')
    const landlordId = request.lease.unit.property.owner_id
    const location = request.lease.unit.property.location
    const bestContractor = await findBestContractor(landlordId, analysis, location)

    if (!bestContractor) {
      throw new Error('No suitable contractor found')
    }

    // Create work order
    console.log('Creating work order...')
    const success = await createWorkOrder(
      maintenanceRequestId,
      bestContractor.id,
      analysis.urgency
    )

    if (!success) {
      throw new Error('Failed to create work order')
    }

    return new Response(
      JSON.stringify({
        success: true,
        contractor: bestContractor,
        analysis: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in auto-assign-maintenance:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})