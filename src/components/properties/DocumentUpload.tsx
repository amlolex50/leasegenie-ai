import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploadProps {
  entityId: string;
  entityType: "property" | "unit";
  onFileSelect: (files: { documents: File | null; images: File[] }) => void;
}

export const DocumentUpload = ({ entityId, entityType, onFileSelect }: DocumentUploadProps) => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedDocument(file);
        onFileSelect({ documents: file, images: selectedImages });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF document",
          variant: "destructive",
        });
        setSelectedDocument(null);
        onFileSelect({ documents: null, images: selectedImages });
      }
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validImages = files.filter(file => file.type.startsWith("image/"));
      
      if (validImages.length !== files.length) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }

      setSelectedImages(validImages);
      onFileSelect({ documents: selectedDocument, images: validImages });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="document">Upload PDF Document</Label>
        <Input
          id="document"
          type="file"
          accept=".pdf"
          onChange={handleDocumentChange}
        />
        <p className="text-sm text-muted-foreground">
          Accepted format: PDF only
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Upload Images</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
        />
        <p className="text-sm text-muted-foreground">
          Accepted formats: JPG, PNG, etc.
        </p>
        {selectedImages.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {selectedImages.length} image(s) selected
          </p>
        )}
      </div>
    </div>
  );
};