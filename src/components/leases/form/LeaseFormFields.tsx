import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TenantSelect } from "./TenantSelect";
import { UnitSelect } from "./UnitSelect";

interface LeaseFormFieldsProps {
  form: UseFormReturn<any>;
}

export const LeaseFormFields = ({ form }: LeaseFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TenantSelect form={form} />
      <UnitSelect form={form} />

      <FormField
        control={form.control}
        name="lease_start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lease_end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="monthly_rent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monthly Rent</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="deposit_amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Security Deposit</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="escalation_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Rent Increase (%)</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};