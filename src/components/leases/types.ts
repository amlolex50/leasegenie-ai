export interface LeaseInsights {
  leaseDuration: {
    startDate: string;
    endDate: string;
    totalMonths: number;
    description: string;
  };
  financials: {
    monthlyRent: number;
    depositAmount: number;
    escalationRate?: number;
    description: string;
  };
  property: {
    description: string;
    responsibilities: string[];
    restrictions: string[];
  };
  tenant: {
    responsibilities: string[];
    restrictions: string[];
    description: string;
  };
}

export interface LeaseData {
  id: string;
  tenant_id: string;
  unit_id: string;
  lease_start_date: string;
  lease_end_date: string;
  monthly_rent: number;
  deposit_amount: number | null;
  escalation_rate: number | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
  insights: LeaseInsights | null;
  tenant: {
    full_name: string;
    email: string;
  };
  unit: {
    unit_name: string;
    property: {
      name: string;
    };
  };
}