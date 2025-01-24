import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UnitFormFields } from "./UnitFormFields";
import { useUnitForm } from "./useUnitForm";
import { DocumentUpload } from "./DocumentUpload";
import { useState } from "react";

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
  const { form, onSubmit } = useUnitForm(propertyId, unit);
  const [showDocumentUpload, setShowDocumentUpload] = useState(!!unit);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UnitFormFields form={form} />
        {showDocumentUpload && (
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">Unit Documents</h3>
            <p className="text-sm text-muted-foreground">
              Upload relevant documents for this unit (PDF or Word documents only)
            </p>
            <DocumentUpload 
              entityId={unit?.id || ""} 
              entityType="unit" 
            />
          </div>
        )}
        <Button type="submit">{unit ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};