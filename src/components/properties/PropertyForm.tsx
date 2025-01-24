import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PropertyFormFields } from "./PropertyFormFields";
import { usePropertyForm } from "./usePropertyForm";
import { Property } from "./types";
import { DocumentUpload } from "./DocumentUpload";

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
        {isEditing && (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Property Documents</h3>
            <DocumentUpload entityId={property.id} entityType="property" />
          </div>
        )}
        <Button type="submit">{isEditing ? "Update" : "Create"} Property</Button>
      </form>
    </Form>
  );
};