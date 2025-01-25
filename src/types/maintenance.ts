export interface MaintenanceRequest {
  id: string;
  lease_id: string;
  submitted_by: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
  updated_at: string;
}

export interface WorkOrder {
  id: string;
  maintenance_request_id: string;
  contractor_id: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  estimated_completion: string;
  actual_completion?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}