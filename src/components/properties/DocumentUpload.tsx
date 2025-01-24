import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DocumentUploadProps {
  entityId: string;
  entityType: "property" | "unit";
  onFileSelect: (file: File | null) => void;
}

export const DocumentUpload = ({ entityId, entityType, onFileSelect }: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || 
          selectedFile.type === "application/msword" || 
          selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        onFileSelect(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive",
        });
        onFileSelect(null);
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="document">Upload Document (PDF or Word)</Label>
      <Input
        id="document"
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
    </div>
  );
};