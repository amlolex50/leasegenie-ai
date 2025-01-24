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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

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
      // First create the property
      const propertyResult = await onSubmit(data);
      
      if (!propertyResult?.id) {
        throw new Error("Failed to create property");
      }

      // Then upload the file
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const bucketName = "property_documents";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const user = await supabase.auth.getUser();
      
      const { error: dbError } = await supabase
        .from('property_documents')
        .insert({
          property_id: propertyResult.id,
          name: selectedFile.name,
          file_path: fileName,
          document_type: selectedFile.type,
          uploaded_by: user.data.user?.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Property created and file uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create property or upload file",
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
            Upload relevant documents or images for this property
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