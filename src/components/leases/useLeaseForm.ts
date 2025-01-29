import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

const leaseFormSchema = z.object({
  tenant_id: z.string().min(1, "Tenant is required"),
  unit_id: z.string().min(1, "Unit is required"),
  lease_start_date: z.string().min(1, "Start date is required"),
  lease_end_date: z.string().min(1, "End date is required"),
  monthly_rent: z.string().min(1, "Monthly rent is required"),
  deposit_amount: z.string().optional(),
  escalation_rate: z.string().optional(),
});

type LeaseFormData = z.infer<typeof leaseFormSchema>;

export const useLeaseForm = (lease?: any) => {
  const form = useForm<LeaseFormData>({
    resolver: zodResolver(leaseFormSchema),
    defaultValues: {
      tenant_id: lease?.tenant_id || "",
      unit_id: lease?.unit_id || "",
      lease_start_date: lease?.lease_start_date || "",
      lease_end_date: lease?.lease_end_date || "",
      monthly_rent: lease?.monthly_rent?.toString() || "",
      deposit_amount: lease?.deposit_amount?.toString() || "",
      escalation_rate: lease?.escalation_rate?.toString() || "",
    },
  });

  const onSubmit = async (values: LeaseFormData) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("Not authenticated");

    const leaseData = {
      tenant_id: values.tenant_id,
      unit_id: values.unit_id,
      lease_start_date: values.lease_start_date,
      lease_end_date: values.lease_end_date,
      monthly_rent: parseFloat(values.monthly_rent),
      deposit_amount: values.deposit_amount ? parseFloat(values.deposit_amount) : null,
      escalation_rate: values.escalation_rate ? parseFloat(values.escalation_rate) : null,
    };

    if (lease?.id) {
      const { data, error } = await supabase
        .from('leases')
        .update(leaseData)
        .eq('id', lease.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('leases')
        .insert(leaseData)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  };

  return { form, onSubmit };
};