import { z } from "zod";

export const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  owner_reference_id: z.string().optional(),
});

export const unitFormSchema = z.object({
  unit_name: z.string().min(1, "Unit name is required"),
  floor_area: z.string().min(1, "Floor area is required"),
  status: z.enum(["VACANT", "OCCUPIED"]),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
export type UnitFormValues = z.infer<typeof unitFormSchema>;

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  owner_reference_id?: string;
}

export interface Unit {
  id: string;
  unit_name: string;
  floor_area: number;
  status: "VACANT" | "OCCUPIED";
}

export interface Owner {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
}