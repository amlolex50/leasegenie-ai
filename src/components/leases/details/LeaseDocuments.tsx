import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaseDocumentsProps {
  pdfUrl: string | null;
  leaseId: string;
}

export const LeaseDocuments = ({ pdfUrl, leaseId }: LeaseDocumentsProps) => {
  const downloadLease = async () => {
    if (!pdfUrl) return;
    
    const { data, error } = await supabase.storage
      .from('lease_documents')
      .download(pdfUrl);

    if (error) {
      console.error('Error downloading lease:', error);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lease-${leaseId}.pdf`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pdfUrl ? (
          <Button onClick={downloadLease} variant="outline" className="w-full">
            Download Lease Agreement
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            No lease document uploaded
          </p>
        )}
      </CardContent>
    </Card>
  );
};