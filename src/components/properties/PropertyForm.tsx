import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PropertyFormFields } from "./PropertyFormFields";
import { usePropertyForm } from "./usePropertyForm";
import { Property } from "./types";
import { DocumentUpload } from "./DocumentUpload";
import { useState } from "react";

interface PropertyFormProps {
  property?: Property;
}

export const PropertyForm = ({ property }: PropertyFormProps) => {
  const { form, onSubmit } = usePropertyForm(property);
  const [tempId] = useState(() => crypto.randomUUID());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PropertyFormFields form={form} />
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Property Documents</h3>
          <p className="text-sm text-muted-foreground">
            Upload relevant documents for this property (PDF or Word documents only)
          </p>
          <DocumentUpload 
            entityId={property?.id || tempId} 
            entityType="property"
            onFileSelect={setSelectedFile}
          />
        </div>
        <Button type="submit">{property ? "Update" : "Create"} Property</Button>
      </form>
    </Form>
  );
};