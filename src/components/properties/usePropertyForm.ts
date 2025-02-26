import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFormValues, propertyFormSchema, Property } from "./types";

export const usePropertyForm = (property?: Property) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property || {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (property?.id) {
        const { data: updatedProperty, error } = await supabase
          .from("properties")
          .update({
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
          })
          .eq("id", property.id)
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property updated successfully",
        });
        
        return updatedProperty;
      } else {
        const { data: newProperty, error } = await supabase
          .from("properties")
          .insert({
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Success",
          description: "Property created successfully",
        });
        
        return newProperty;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    form,
    onSubmit,
  };
};