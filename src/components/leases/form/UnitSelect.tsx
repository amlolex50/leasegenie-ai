import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UnitSelectProps {
  form: UseFormReturn<any>;
}

export const UnitSelect = ({ form }: UnitSelectProps) => {
  const { data: units } = useQuery({
    queryKey: ['available-units'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('units')
        .select('id, unit_name, property:properties(name)')
        .eq('status', 'VACANT');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unit</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {units?.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.property.name} - {unit.unit_name}
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