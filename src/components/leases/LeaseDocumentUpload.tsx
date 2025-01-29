import { FileUpload } from "./FileUpload";
import { LeaseDocumentUploadProps } from "./types";

export const LeaseDocumentUpload = ({ onFileSelect }: LeaseDocumentUploadProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Lease Document</h3>
      <FileUpload 
        onFileSelect={onFileSelect}
        accept=".pdf"
        maxSize={5242880} // 5MB
      />
    </div>
  );
};