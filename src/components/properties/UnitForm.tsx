import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UnitFormFields } from "./UnitFormFields";
import { useUnitForm } from "./useUnitForm";
import { DocumentUpload } from "./DocumentUpload";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [tempId] = useState(() => crypto.randomUUID());

  const handleSubmit = async (data: any) => {
    if (!selectedFile) {
      toast({
        title: "Missing file",
        description: "Please select a document or image to upload",
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

      // Then upload the file
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const bucketName = "unit_documents";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const user = await supabase.auth.getUser();
      
      const { error: dbError } = await supabase
        .from('unit_documents')
        .insert({
          unit_id: unitResult.id,
          name: selectedFile.name,
          file_path: fileName,
          document_type: selectedFile.type,
          uploaded_by: user.data.user?.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Unit created and file uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create unit or upload file",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <UnitFormFields form={form} />
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Unit Documents & Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload relevant documents or images for this unit
          </p>
          <DocumentUpload 
            entityId={unit?.id || tempId} 
            entityType="unit"
            onFileSelect={setSelectedFile}
          />
        </div>
        <Button type="submit">{unit ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};