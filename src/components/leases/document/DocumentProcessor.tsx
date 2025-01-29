import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProcessingProgress } from "./ProcessingProgress";
import { DocumentProcessorProps } from "../types";
import { useDocumentProcessing } from "./useDocumentProcessing";

export const DocumentProcessor = ({ leaseId, documentUrl, onProcessingComplete }: DocumentProcessorProps) => {
  const { isProcessing, progress, processDocument } = useDocumentProcessing();

  const handleProcessDocument = async () => {
    const success = await processDocument(documentUrl!, leaseId);
    if (success) {
      setTimeout(() => {
        onProcessingComplete?.();
      }, 500);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing && <ProcessingProgress progress={progress} />}
      <Button 
        onClick={handleProcessDocument} 
        disabled={isProcessing || !documentUrl}
        variant="secondary"
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Document...
          </>
        ) : (
          'Process Document'
        )}
      </Button>
    </div>
  );
};