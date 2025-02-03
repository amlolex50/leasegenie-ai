export interface Owner {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface OwnerFormData {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
}