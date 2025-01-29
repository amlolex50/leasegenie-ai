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

    // Upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lease_documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    if (!uploadData?.path) {
      throw new Error('No upload path returned');
    }

    // Get the signed URL only after confirming upload success
    const { data: urlData, error: urlError } = await supabase.storage
      .from('lease_documents')
      .createSignedUrl(uploadData.path, 60 * 60); // 1 hour expiry

    if (urlError) {
      console.error('Signed URL error:', urlError);
      throw urlError;
    }

    if (!urlData?.signedUrl) {
      throw new Error('No signed URL returned');
    }

    // Update the lease with the file path (not the signed URL)
    const { error: updateError } = await supabase
      .from('leases')
      .update({ pdf_url: uploadData.path })
      .eq('id', leaseId);

    if (updateError) {
      console.error('Lease update error:', updateError);
      throw updateError;
    }

    setDocumentUrl(urlData.signedUrl);
    return urlData.signedUrl;
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
        try {
          const signedUrl = await handleDocumentUpload(selectedFile, leaseResult.id);
          if (signedUrl) {
            toast({
              title: "Success",
              description: "Lease created successfully. Processing document...",
            });
          }
        } catch (uploadError: any) {
          console.error('Document upload error:', uploadError);
          toast({
            title: "Warning",
            description: "Lease created but document upload failed. Please try uploading the document again.",
            variant: "destructive",
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
      console.error('Lease submission error:', error);
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