import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PropertyFormFields } from "./PropertyFormFields";
import { usePropertyForm } from "./usePropertyForm";
import { Property } from "./types";

interface PropertyFormProps {
  property?: Property;
}

export const PropertyForm = ({ property }: PropertyFormProps) => {
  const { form, onSubmit } = usePropertyForm(property);
  const isEditing = !!property;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <PropertyFormFields form={form} />
        <Button type="submit">{isEditing ? "Update" : "Create"} Property</Button>
      </form>
    </Form>
  );
};