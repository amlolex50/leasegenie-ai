export interface Contractor {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  speciality: string | null;
  skills: string[];
  hourly_rate: number | null;
  availability_status: string;
  rating: number;
}

export interface ContractorFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  speciality: string;
  skills: string;
  hourly_rate: string;
}