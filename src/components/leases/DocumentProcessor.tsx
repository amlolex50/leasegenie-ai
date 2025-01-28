import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DocumentProcessorProps {
  leaseId: string;
  documentUrl: string | null;
  onProcessingComplete?: () => void;
}

export const DocumentProcessor = ({ leaseId, documentUrl, onProcessingComplete }: DocumentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/functions/v1/process-lease-documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          urls: [documentUrl],
          leaseId: leaseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const result = await response.json();
      
      toast({
        title: "Success",
        description: "Document processed successfully",
      });

      onProcessingComplete?.();
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process document",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={processDocument} 
      disabled={isProcessing || !documentUrl}
      variant="secondary"
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
  );
};