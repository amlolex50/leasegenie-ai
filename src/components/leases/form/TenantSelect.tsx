import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TenantSelectProps {
  form: UseFormReturn<any>;
}

export const TenantSelect = ({ form }: TenantSelectProps) => {
  const { data: tenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('role', 'TENANT');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="tenant_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tenant</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select tenant" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {tenants?.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};