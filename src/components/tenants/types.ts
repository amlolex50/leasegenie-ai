export interface Tenant {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  role: string;
  landlord_id: string;
  date_of_birth?: string;
  nationality?: string;
  gender?: string;
}

export interface TenantFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  date_of_birth: string;
  nationality: string;
  gender: string;
}