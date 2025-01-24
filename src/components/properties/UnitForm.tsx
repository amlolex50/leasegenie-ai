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
  const [tempId] = useState(() => crypto.randomUUID());

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <UnitFormFields form={form} />
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Unit Documents</h3>
          <p className="text-sm text-muted-foreground">
            Upload relevant documents for this unit (PDF or Word documents only)
          </p>
          <DocumentUpload 
            entityId={unit?.id || tempId} 
            entityType="unit" 
          />
        </div>
        <Button type="submit">{unit ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};