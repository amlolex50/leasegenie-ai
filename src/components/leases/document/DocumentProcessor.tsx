import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProcessingProgress } from "./ProcessingProgress";
import { DocumentProcessorProps } from "../types";

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
      console.log('Starting document processing for lease:', leaseId);
      console.log('Document URL:', documentUrl);
      
      // Process document and get extracted text
      const processResult = await supabase.functions.invoke('process-lease-documents', {
        body: {
          urls: [documentUrl],
          leaseId: leaseId,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Process result:', processResult);

      if (processResult.error) {
        throw new Error(processResult.error.message || 'Failed to process document');
      }

      if (!processResult.data || !processResult.data.text) {
        throw new Error('No text extracted from document');
      }

      setProgress(60);

      // Store embeddings using the extracted text
      console.log('Storing embeddings for lease:', leaseId);
      const embeddingResult = await supabase.functions.invoke('store-document-embeddings', {
        body: {
          documentText: processResult.data.text,
          leaseId,
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Embedding result:', embeddingResult);

      if (embeddingResult.error) {
        console.error('Error storing embeddings:', embeddingResult.error);
        toast({
          title: "Warning",
          description: "Document processed but failed to store embeddings. Some AI features may be limited.",
          variant: "destructive",
        });
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
        description: error.message || "Failed to process document. Please try again.",
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