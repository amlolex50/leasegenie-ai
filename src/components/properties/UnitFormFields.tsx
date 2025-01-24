import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UnitFormValues } from "./types";

interface UnitFormFieldsProps {
  form: UseFormReturn<UnitFormValues>;
}

export const UnitFormFields = ({ form }: UnitFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="unit_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unit Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter unit name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="floor_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Floor Area (sq ft)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter floor area"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="VACANT">Vacant</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};