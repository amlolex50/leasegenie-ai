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
      // Step 1: Extract text from document
      console.log('Starting text extraction for document:', documentUrl);
      const extractResult = await supabase.functions.invoke('extract-lease-text', {
        body: JSON.stringify({
          urls: [documentUrl]
        })
      });

      if (extractResult.error) {
        throw new Error(`Text extraction failed: ${extractResult.error.message}`);
      }

      setProgress(50);
      console.log('Text extracted successfully');

      // Step 2: Generate insights using OpenAI
      console.log('Starting insight generation');
      const insightResult = await supabase.functions.invoke('generate-lease-insights', {
        body: JSON.stringify({
          documentText: extractResult.data.text,
          leaseId
        })
      });

      if (insightResult.error) {
        throw new Error(`Insight generation failed: ${insightResult.error.message}`);
      }

      setProgress(90);
      console.log('Insights generated successfully');

      // Step 3: Update lease with insights
      const { error: updateError } = await supabase
        .from('leases')
        .update({ insights: insightResult.data.insights })
        .eq('id', leaseId);

      if (updateError) {
        console.error('Error updating lease with insights:', updateError);
        throw new Error('Failed to save lease insights');
      }

      setProgress(100);
      toast({
        title: "Success",
        description: "Document processed and insights generated successfully",
      });

      return true;

    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process document",
        variant: "destructive",
      });
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