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

      const payload = {
        urls: [documentUrl],
        leaseId: leaseId,
      };

      // Detailed logging of the request
      console.group('Document Processing Request Details');
      console.log('Document URL:', documentUrl);
      console.log('Lease ID:', leaseId);
      console.log('Full payload:', payload);
      console.log('Headers:', {
        Authorization: `Bearer ${session.access_token.substring(0, 10)}...`, // Log partial token for security
        'Content-Type': 'application/json'
      });
      console.groupEnd();

      const processResult = await supabase.functions.invoke('process-lease-documents', {
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      // Log the response details
      console.group('Document Processing Response');
      console.log('Status:', processResult.error ? 'Error' : 'Success');
      console.log('Response data:', processResult.data);
      if (processResult.error) {
        console.error('Error details:', processResult.error);
      }
      console.groupEnd();

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
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      });

      // Log embedding result
      console.group('Embedding Processing');
      console.log('Embedding result:', embeddingResult);
      if (embeddingResult.error) {
        console.error('Embedding error:', embeddingResult.error);
      }
      console.groupEnd();

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