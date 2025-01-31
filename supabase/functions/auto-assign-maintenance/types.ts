export interface MaintenanceRequest {
  id: string;
  description: string;
  priority: string;
  lease_id: string;
  submitted_by: string;
  lease: {
    unit: {
      property: {
        owner_id: string;
        location: string;
        name: string;
      };
    };
  };
}

export interface Contractor {
  id: string;
  full_name: string;
  skills: string[];
  location: string;
  availability_status: string;
  landlord_id: string;
  phone: string;
  hourly_rate: number | null;
  rating: number | null;
}

export interface RequestAnalysis {
  category: string;
  required_skills: string[];
  urgency: number;
}

export interface ContractorSelection {
  contractor: Contractor;
  reasoning: string;
}