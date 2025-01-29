import { Form } from "@/components/ui/form";
import { useLeaseForm } from "./useLeaseForm";
import { LeaseFormFields } from "./form/LeaseFormFields";
import { useState } from "react";
import { LeaseDocumentUpload } from "./document/LeaseDocumentUpload";
import { SubmitButton } from "./SubmitButton";
import { DocumentProcessor } from "./document/DocumentProcessor";
import { useLeaseSubmission } from "./useLeaseSubmission";
import { LeaseFormProps } from "./types";

export const LeaseForm = ({ lease }: LeaseFormProps) => {
  const { form, onSubmit } = useLeaseForm(lease);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    isLoading,
    uploadedLeaseId,
    documentUrl,
    handleSubmit,
    handleProcessingComplete,
  } = useLeaseSubmission(lease);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data, selectedFile, onSubmit))} className="space-y-6">
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