import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useLeaseForm } from "./useLeaseForm";
import { FileUpload } from "./FileUpload";
import { LeaseFormFields } from "./LeaseFormFields";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const leaseResult = await onSubmit(data);
      
      if (!leaseResult?.id) {
        throw new Error("Failed to create lease");
      }

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('lease_documents')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

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

      navigate(`/leases/${leaseResult.id}`);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <LeaseFormFields form={form} />
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Lease Document</h3>
          <FileUpload 
            onFileSelect={setSelectedFile}
            accept=".pdf"
            maxSize={5242880} // 5MB
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {lease ? 'Updating' : 'Creating'} Lease...
            </>
          ) : (
            lease ? 'Update Lease' : 'Create Lease'
          )}
        </Button>
      </form>
    </Form>
  );
};