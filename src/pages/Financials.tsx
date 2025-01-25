import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RentCollection } from "@/components/financials/RentCollection";
import { PaymentHistory } from "@/components/financials/PaymentHistory";
import { FinancialReporting } from "@/components/financials/FinancialReporting";

const Financials = () => {
  const [activeTab, setActiveTab] = useState("rent-collection");

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Financials & Payments</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="rent-collection">Rent Collection</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>
          <TabsContent value="rent-collection">
            <RentCollection />
          </TabsContent>
          <TabsContent value="payment-history">
            <PaymentHistory />
          </TabsContent>
          <TabsContent value="reporting">
            <FinancialReporting />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Financials;