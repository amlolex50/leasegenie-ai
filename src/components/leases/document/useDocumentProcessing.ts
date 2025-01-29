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
        body: {
          urls: [documentUrl]
        }
      });

      if (extractResult.error) {
        throw new Error(`Text extraction failed: ${extractResult.error.message}`);
      }

      setProgress(40);
      console.log('Text extracted successfully:', extractResult.data);

      // Step 2: Run generate insights and store embeddings in parallel
      const [insightResult, embeddingResult] = await Promise.all([
        // Generate insights using OpenAI
        supabase.functions.invoke('generate-lease-insights', {
          body: {
            documentText: extractResult.data.text,
            leaseId
          }
        }),
        // Store document embeddings
        supabase.functions.invoke('store-document-embeddings', {
          body: {
            documentText: extractResult.data.text,
            leaseId
          }
        })
      ]);

      setProgress(70);
      console.log('Parallel processing completed');

      if (insightResult.error) {
        throw new Error(`Insight generation failed: ${insightResult.error.message}`);
      }

      if (embeddingResult.error) {
        console.error('Embedding storage failed:', embeddingResult.error);
        // Don't throw here as we still want to continue if insights succeeded
      }

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