import { supabase } from "@/integrations/supabase/client";
import { UseToastReturn } from "@/components/ui/use-toast";

interface FileUploadHandlerProps {
  unitId: string;
  selectedFiles: {
    documents: File | null;
    images: File[];
  };
  toast: UseToastReturn["toast"];
}

export const handleFileUploads = async ({ unitId, selectedFiles, toast }: FileUploadHandlerProps) => {
  try {
    if (!selectedFiles.documents) {
      throw new Error("Missing document");
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

        // Insert into unit_images table
        const { error: imageInsertError } = await supabase
          .from('unit_images')
          .insert({
            unit_id: unitId,
            image_url: imageFileName
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
        unit_id: unitId,
        name: selectedFiles.documents.name,
        file_path: docFileName,
        document_type: selectedFiles.documents.type,
        uploaded_by: user.data.user?.id,
      });

    if (docMetaError) throw docMetaError;

    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};