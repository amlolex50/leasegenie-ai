import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useLeaseSubmission = (lease?: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedLeaseId, setUploadedLeaseId] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDocumentUpload = async (file: File, leaseId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lease_documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = await supabase.storage
      .from('lease_documents')
      .createSignedUrl(fileName, 60 * 60); // 1 hour expiry

    if (urlData?.signedUrl) {
      setDocumentUrl(urlData.signedUrl);
    }

    const { error: updateError } = await supabase
      .from('leases')
      .update({ pdf_url: fileName })
      .eq('id', leaseId);

    if (updateError) throw updateError;

    return urlData?.signedUrl || null;
  };

  const handleProcessingComplete = () => {
    toast({
      title: "Success",
      description: "Document processed successfully",
    });
    navigate('/leases');
  };

  const handleSubmit = async (data: any, selectedFile: File | null, onSubmit: (data: any) => Promise<any>) => {
    if (!lease && !selectedFile) {
      toast({
        title: "Error",
        description: "Please upload a lease document",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const leaseResult = await onSubmit(data);
      
      if (!leaseResult?.id) {
        throw new Error("Failed to create lease");
      }

      setUploadedLeaseId(leaseResult.id);

      if (selectedFile) {
        const signedUrl = await handleDocumentUpload(selectedFile, leaseResult.id);
        if (signedUrl) {
          toast({
            title: "Success",
            description: "Lease created successfully. Processing document...",
          });
        }
      } else {
        toast({
          title: "Success",
          description: `Lease ${lease ? 'updated' : 'created'} successfully`,
        });
        navigate('/leases');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    uploadedLeaseId,
    documentUrl,
    handleSubmit,
    handleProcessingComplete,
  };
};