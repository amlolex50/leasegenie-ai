import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Database, Bot } from "lucide-react";

export const OnboardingProcess = () => {
  return (
    <section className="mb-12 sm:mb-20">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-center">
        Getting Started with Smart Lease Management
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <Card>
          <CardHeader>
            <Upload className="w-12 h-12 mb-4 text-blue-600" />
            <CardTitle>1. Upload Your Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Simply upload your existing lease documents in PDF format. Our AI will automatically extract and
              organize key information.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Database className="w-12 h-12 mb-4 text-green-600" />
            <CardTitle>2. AI Data Extraction</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our AI system analyzes your documents, extracting crucial details like rent amounts, important dates,
              and special clauses.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <Bot className="w-12 h-12 mb-4 text-purple-600" />
            <CardTitle>3. Verify and Customize</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Review the extracted data, make any necessary adjustments, and customize your dashboard to suit your
              needs.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};