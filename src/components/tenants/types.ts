export interface Tenant {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  role: string;
  landlord_id: string;
}

export interface TenantFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
}