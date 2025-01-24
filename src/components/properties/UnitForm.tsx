import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const unitFormSchema = z.object({
  unit_name: z.string().min(1, "Unit name is required"),
  floor_area: z.string().min(1, "Floor area is required"),
  status: z.enum(["VACANT", "OCCUPIED"]),
});

type UnitFormValues = z.infer<typeof unitFormSchema>;

interface UnitFormProps {
  propertyId: string;
  unit?: {
    id: string;
    unit_name: string;
    floor_area: number;
    status: "VACANT" | "OCCUPIED";
  };
}

export const UnitForm = ({ propertyId, unit }: UnitFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isEditing = !!unit;

  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: unit
      ? {
          unit_name: unit.unit_name,
          floor_area: unit.floor_area.toString(),
          status: unit.status,
        }
      : {
          unit_name: "",
          floor_area: "",
          status: "VACANT",
        },
  });

  const onSubmit = async (data: UnitFormValues) => {
    try {
      const unitData = {
        ...data,
        property_id: propertyId,
        floor_area: parseFloat(data.floor_area),
      };

      if (isEditing) {
        const { error } = await supabase
          .from("units")
          .update(unitData)
          .eq("id", unit.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Unit updated successfully",
        });
      } else {
        const { error } = await supabase.from("units").insert([unitData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Unit created successfully",
        });
      }

      navigate(`/properties/${propertyId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save unit",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit">{isEditing ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};