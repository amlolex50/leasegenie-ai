import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
}

export const FileUpload = ({ onFileSelect, accept = "*", maxSize }: FileUploadProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (maxSize && file.size > maxSize) {
        toast({
          title: "File too large",
          description: `File size should be less than ${maxSize / 1024 / 1024}MB`,
          variant: "destructive",
        });
        setSelectedFile(null);
        onFileSelect(null);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file">Upload Document</Label>
      <Input
        id="file"
        type="file"
        accept={accept}
        onChange={handleFileChange}
      />
      {selectedFile && (
        <p className="text-sm text-muted-foreground">
          Selected file: {selectedFile.name}
        </p>
      )}
    </div>
  );
};