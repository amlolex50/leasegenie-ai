import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processDocument = async (documentUrl: string, leaseId: string) => {
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "No document URL provided",
        variant: "destructive",
      });
      return false;
    }

    setIsProcessing(true);
    setProgress(10);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }
      setProgress(30);

      console.log('Starting document processing with payload:', {
        urls: [documentUrl],
        leaseId: leaseId,
      });

      const processResult = await supabase.functions.invoke('process-lease-documents', {
        body: JSON.stringify({
          urls: [documentUrl],
          leaseId: leaseId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (processResult.error) {
        throw processResult.error;
      }

      if (!processResult.data) {
        throw new Error('No data returned from processing');
      }

      setProgress(60);

      const embeddingResult = await supabase.functions.invoke('store-document-embeddings', {
        body: JSON.stringify({
          documentText: processResult.data.text,
          leaseId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (embeddingResult.error) {
        console.error('Error storing embeddings:', embeddingResult.error);
      }

      setProgress(90);

      toast({
        title: "Success",
        description: "Document processed successfully",
      });

      setProgress(100);
      return true;
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process document",
        variant: "destructive",
      });
      setProgress(0);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    progress,
    processDocument
  };
};