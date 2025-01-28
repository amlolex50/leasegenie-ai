import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DocumentProcessorProps {
  leaseId: string;
  documentUrl: string | null;
  onProcessingComplete?: () => void;
}

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
    setProgress(10); // Start progress

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      setProgress(30); // Update progress before API call

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

      setProgress(60); // Update progress after API call

      if (!response.ok) {
        throw new Error('Failed to process document');
      }

      const result = await response.json();
      
      setProgress(90); // Almost done

      toast({
        title: "Success",
        description: "Document processed successfully",
      });

      setProgress(100); // Complete

      // Small delay to show completion before navigating
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
      setProgress(0); // Reset progress on error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Processing document... {progress}%
          </p>
        </div>
      )}
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