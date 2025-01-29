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
      console.log('Starting document processing with URL:', documentUrl);
      
      // Step 1: Extract text from document
      const extractResult = await supabase.functions.invoke('extract-lease-text', {
        body: JSON.stringify({ documentUrl })
      });

      console.log('Text extraction result:', extractResult);

      if (extractResult.error) {
        throw new Error(`Text extraction failed: ${extractResult.error.message}`);
      }

      if (!extractResult.data?.text) {
        throw new Error('No text extracted from document');
      }

      setProgress(50);
      
      // Store the extracted text temporarily
      // We'll use this in Step 2 for OpenAI analysis
      console.log('Extracted text:', extractResult.data.text);

      toast({
        title: "Success",
        description: "Text extracted successfully",
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