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

      // Upload PDF document to unit_documents bucket
      const docExt = selectedFiles.documents.name.split('.').pop();
      const docFileName = `${crypto.randomUUID()}.${docExt}`;

      const { error: docUploadError } = await supabase.storage
        .from("unit_documents")
        .upload(docFileName, selectedFiles.documents);

      if (docUploadError) throw docUploadError;

      // Upload images to unit_images bucket
      const imageUploads = await Promise.all(
        selectedFiles.images.map(async (image) => {
          const imageExt = image.name.split('.').pop();
          const imageFileName = `${crypto.randomUUID()}.${imageExt}`;

          const { error: imageUploadError } = await supabase.storage
            .from("unit_images")
            .upload(imageFileName, image);

          if (imageUploadError) throw imageUploadError;

          // Get the public URL for the uploaded image
          const { data: publicUrl } = supabase.storage
            .from("unit_images")
            .getPublicUrl(imageFileName);

          // Insert into unit_images table
          const { error: imageInsertError } = await supabase
            .from('unit_images')
            .insert({
              unit_id: unitResult.id,
              image_url: imageFileName // Store just the filename
            });

          if (imageInsertError) throw imageInsertError;

          return { fileName: imageFileName, originalName: image.name, type: image.type };
        })
      );

      const user = await supabase.auth.getUser();
      
      // Save document metadata
      const { error: docMetaError } = await supabase
        .from('unit_documents')
        .insert({
          unit_id: unitResult.id,
          name: selectedFiles.documents.name,
          file_path: docFileName,
          document_type: selectedFiles.documents.type,
          uploaded_by: user.data.user?.id,
        });

      if (docMetaError) throw docMetaError;

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
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Unit Documents & Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload relevant documents and images for this unit
          </p>
          <DocumentUpload 
            entityId={unit?.id || tempId} 
            entityType="unit"
            onFileSelect={setSelectedFiles}
          />
        </div>
        <Button type="submit">{unit ? "Update" : "Create"} Unit</Button>
      </form>
    </Form>
  );
};