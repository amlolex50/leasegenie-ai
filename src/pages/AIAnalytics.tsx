import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIAssistant } from "@/components/ai-analytics/AIAssistant"
import { AIInsights } from "@/components/ai-analytics/AIInsights"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState("ai-assistant")

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">AI & Analytics</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-6">
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="ai-assistant">
            <AIAssistant />
          </TabsContent>
          <TabsContent value="ai-insights">
            <AIInsights />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}