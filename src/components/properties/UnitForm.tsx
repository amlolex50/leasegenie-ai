import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UnitFormFields } from "./UnitFormFields";
import { useUnitForm } from "./useUnitForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { FileUploadSection } from "./unit-form/FileUploadSection";
import { handleFileUploads } from "./unit-form/FileUploadHandler";

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
  const [selectedFiles, setSelectedFiles] = useState<{ documents: File | null; images: File[] }>({
    documents: null,
    images: []
  });
  const { toast } = useToast();
  const [tempId] = useState(() => crypto.randomUUID());

  const handleSubmit = async (data: any) => {
    if (!selectedFiles.documents) {
      toast({
        title: "Missing document",
        description: "Please select a PDF document to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create the unit
      const unitResult = await onSubmit(data);
      
      if (!unitResult) {
        throw new Error("Failed to create unit");
      }

      // Handle file uploads
      await handleFileUploads({
        unitId: unitResult.id,
        selectedFiles,
        toast
      });

      toast({
        title: "Success",
        description: "Unit created and files uploaded successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create unit or upload files",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UnitFormFields form={form} />
        <FileUploadSection
          entityId={unit?.id || tempId}
          onFileSelect={setSelectedFiles}
        />
        <Button type="submit">{unit ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};