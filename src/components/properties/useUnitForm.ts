import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UnitFormValues, unitFormSchema } from "./types";

export const useUnitForm = (propertyId: string, unit?: {
  id: string;
  unit_name: string;
  floor_area: number;
  status: "VACANT" | "OCCUPIED";
}) => {
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
        unit_name: data.unit_name,
        property_id: propertyId,
        floor_area: parseFloat(data.floor_area),
        status: data.status,
      };

      if (isEditing && unit) {
        const { data: updatedUnit, error } = await supabase
          .from("units")
          .update(unitData)
          .eq("id", unit.id)
          .select()
          .single();

        if (error) throw error;
        return updatedUnit;
      } else {
        const { data: newUnit, error } = await supabase
          .from("units")
          .insert(unitData)
          .select()
          .single();

        if (error) throw error;
        return newUnit;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save unit",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    form,
    onSubmit,
    isEditing,
  };
};