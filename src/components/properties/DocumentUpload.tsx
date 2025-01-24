import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  entityId: string;
  entityType: "property" | "unit";
}

export const DocumentUpload = ({ entityId, entityType }: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || 
          selectedFile.type === "application/msword" || 
          selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const bucketName = entityType === "property" ? "property_documents" : "unit_documents";

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const user = await supabase.auth.getUser();
      
      if (entityType === "property") {
        const { error: dbError } = await supabase
          .from('property_documents')
          .insert({
            property_id: entityId,
            name: file.name,
            file_path: fileName,
            document_type: file.type,
            uploaded_by: user.data.user?.id,
          });
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from('unit_documents')
          .insert({
            unit_id: entityId,
            name: file.name,
            file_path: fileName,
            document_type: file.type,
            uploaded_by: user.data.user?.id,
          });
        if (dbError) throw dbError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document">Upload Document (PDF or Word)</Label>
        <Input
          id="document"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      {file && (
        <Button 
          onClick={handleUpload} 
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </Button>
      )}
    </div>
  );
};