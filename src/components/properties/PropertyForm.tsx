import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PropertyFormFields } from "./PropertyFormFields";
import { usePropertyForm } from "./usePropertyForm";
import { Property } from "./types";
import { DocumentUpload } from "./DocumentUpload";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyFormProps {
  property?: Property;
}

export const PropertyForm = ({ property }: PropertyFormProps) => {
  const { form, onSubmit } = usePropertyForm(property);
  const [tempId] = useState(() => crypto.randomUUID());
  const [selectedFiles, setSelectedFiles] = useState<{ documents: File | null; images: File[] }>({
    documents: null,
    images: []
  });
  const { toast } = useToast();

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
      // First create the property
      const propertyResult = await onSubmit(data);
      
      if (!propertyResult?.id) {
        throw new Error("Failed to create property");
      }

      // Upload PDF document
      const docExt = selectedFiles.documents.name.split('.').pop();
      const docFileName = `${crypto.randomUUID()}.${docExt}`;

      const { error: docUploadError } = await supabase.storage
        .from("property_documents")
        .upload(docFileName, selectedFiles.documents);

      if (docUploadError) throw docUploadError;

      // Upload images
      const imageUploads = await Promise.all(
        selectedFiles.images.map(async (image) => {
          const imageExt = image.name.split('.').pop();
          const imageFileName = `${crypto.randomUUID()}.${imageExt}`;

          const { error: imageUploadError } = await supabase.storage
            .from("property_documents")
            .upload(imageFileName, image);

          if (imageUploadError) throw imageUploadError;

          return { fileName: imageFileName, originalName: image.name, type: image.type };
        })
      );

      const user = await supabase.auth.getUser();
      
      // Save document metadata
      const { error: docMetaError } = await supabase
        .from('property_documents')
        .insert({
          property_id: propertyResult.id,
          name: selectedFiles.documents.name,
          file_path: docFileName,
          document_type: selectedFiles.documents.type,
          uploaded_by: user.data.user?.id,
        });

      if (docMetaError) throw docMetaError;

      // Save image metadata
      if (imageUploads.length > 0) {
        const { error: imageMetaError } = await supabase
          .from('property_documents')
          .insert(
            imageUploads.map(image => ({
              property_id: propertyResult.id,
              name: image.originalName,
              file_path: image.fileName,
              document_type: image.type,
              uploaded_by: user.data.user?.id,
            }))
          );

        if (imageMetaError) throw imageMetaError;
      }

      toast({
        title: "Success",
        description: "Property created and files uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create property or upload files",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PropertyFormFields form={form} />
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Property Documents & Images</h3>
          <p className="text-sm text-muted-foreground">
            Upload relevant documents and images for this property
          </p>
          <DocumentUpload 
            entityId={property?.id || tempId} 
            entityType="property"
            onFileSelect={setSelectedFiles}
          />
        </div>
        <Button type="submit">{property ? "Update" : "Create"} Property</Button>
      </form>
    </Form>
  );
};