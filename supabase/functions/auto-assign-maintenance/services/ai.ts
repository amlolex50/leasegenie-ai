import { MODELS } from '../../_shared/config.ts';
import { Contractor, RequestAnalysis, ContractorSelection } from '../types.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

export async function analyzeRequest(description: string): Promise<RequestAnalysis> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELS.GPT4,
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
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function selectBestContractor(
  contractors: Contractor[],
  analysis: RequestAnalysis,
  workOrders: any[],
  location: string
): Promise<ContractorSelection> {
  const contractorDetails = contractors.map(contractor => ({
    id: contractor.id,
    name: contractor.full_name,
    skills: contractor.skills,
    location: contractor.location,
    rating: contractor.rating || 0,
    hourly_rate: contractor.hourly_rate || 0,
    open_orders: workOrders.filter(wo => wo.contractor_id === contractor.id).length,
  }));

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELS.GPT4,
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that helps select the best contractor for maintenance requests.
          Consider the following factors in order of importance:
          1. Required skills match
          2. Contractor location and proximity to the job
          3. Current workload (fewer open orders is better)
          4. Contractor rating (especially important for urgent issues)
          5. Cost efficiency
          
          Analyze the data and return a JSON object with:
          1. selected_contractor_id: ID of the best contractor
          2. reasoning: Detailed explanation of why this contractor was chosen`
        },
        {
          role: 'user',
          content: JSON.stringify({
            maintenance_request: {
              category: analysis.category,
              required_skills: analysis.required_skills,
              urgency: analysis.urgency,
              location: location
            },
            available_contractors: contractorDetails
          })
        }
      ]
    })
  });

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.content);
  
  const selectedContractor = contractors.find(c => c.id === result.selected_contractor_id);
  if (!selectedContractor) {
    throw new Error('Selected contractor not found in contractor list');
  }

  return {
    contractor: selectedContractor,
    reasoning: result.reasoning
  };
}