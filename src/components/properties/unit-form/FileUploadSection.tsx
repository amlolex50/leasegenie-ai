import { DocumentUpload } from "../DocumentUpload";
import { useState } from "react";

interface FileUploadSectionProps {
  entityId: string;
  onFileSelect: (files: { documents: File | null; images: File[] }) => void;
}

export const FileUploadSection = ({ entityId, onFileSelect }: FileUploadSectionProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Unit Documents & Images</h3>
      <p className="text-sm text-muted-foreground">
        Upload relevant documents and images for this unit
      </p>
      <DocumentUpload 
        entityId={entityId}
        entityType="unit"
        onFileSelect={onFileSelect}
      />
    </div>
  );
};