import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProcessingProgress } from "./ProcessingProgress";
import { DocumentProcessorProps } from "./types";

export const DocumentProcessor = ({ leaseId, documentUrl, onProcessingComplete }: DocumentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processDocument = async () => {
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "No document URL provided",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      setProgress(30);

      // Call both functions in parallel
      const [processResult, embeddingResult] = await Promise.all([
        supabase.functions.invoke('process-lease-documents', {
          body: {
            urls: [documentUrl],
            leaseId: leaseId,
          }
        }),
        supabase.functions.invoke('store-document-embeddings', {
          body: {
            documentUrl,
            leaseId,
          }
        })
      ]);

      if (processResult.error) {
        throw processResult.error;
      }

      if (embeddingResult.error) {
        console.error('Error storing embeddings:', embeddingResult.error);
        // Don't throw here, as we still want to continue if the main processing succeeded
      }

      setProgress(90);

      toast({
        title: "Success",
        description: "Document processed successfully",
      });

      setProgress(100);

      setTimeout(() => {
        onProcessingComplete?.();
      }, 500);

    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process document",
        variant: "destructive",
      });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing && <ProcessingProgress progress={progress} />}
      <Button 
        onClick={processDocument} 
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