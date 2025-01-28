import { Form } from "@/components/ui/form";
import { useLeaseForm } from "./useLeaseForm";
import { LeaseFormFields } from "./LeaseFormFields";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LeaseDocumentUpload } from "./LeaseDocumentUpload";
import { SubmitButton } from "./SubmitButton";
import { DocumentProcessor } from "./DocumentProcessor";

interface LeaseFormProps {
  lease?: {
    id: string;
    tenant_id: string;
    unit_id: string;
    lease_start_date: string;
    lease_end_date: string;
    monthly_rent: number;
    deposit_amount?: number;
    escalation_rate?: number;
  };
}

export const LeaseForm = ({ lease }: LeaseFormProps) => {
  const { form, onSubmit } = useLeaseForm(lease);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedLeaseId, setUploadedLeaseId] = useState<string | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
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
      toast({
        title: "Processing",
        description: "Creating lease and uploading document...",
      });

      const leaseResult = await onSubmit(data);
      
      if (!leaseResult?.id) {
        throw new Error("Failed to create lease");
      }

      setUploadedLeaseId(leaseResult.id);

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('lease_documents')
          .upload(fileName, selectedFile);

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
          .eq('id', leaseResult.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: `Lease ${lease ? 'updated' : 'created'} successfully`,
      });

      // Don't navigate immediately if we need to process the document
      if (!selectedFile) {
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

  const handleProcessingComplete = () => {
    navigate('/leases');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <LeaseFormFields form={form} />
        <LeaseDocumentUpload onFileSelect={setSelectedFile} />
        <div className="flex gap-4 items-center">
          <SubmitButton isLoading={isLoading} isEdit={!!lease} />
          {uploadedLeaseId && documentUrl && (
            <DocumentProcessor 
              leaseId={uploadedLeaseId}
              documentUrl={documentUrl}
              onProcessingComplete={handleProcessingComplete}
            />
          )}
        </div>
      </form>
    </Form>
  );
};