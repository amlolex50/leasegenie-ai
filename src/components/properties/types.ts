import { z } from "zod";

export const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}