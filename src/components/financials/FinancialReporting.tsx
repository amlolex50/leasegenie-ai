"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinancialData } from "./reports/useFinancialData"
import { RevenueReport } from "./reports/RevenueReport"
import { ExpenseReport } from "./reports/ExpenseReport"
import { ProfitLossReport } from "./reports/ProfitLossReport"

export function FinancialReporting() {
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const { revenueData, expenseData, profitLossData, loading } = useFinancialData(reportPeriod)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Reports</CardTitle>
          <CardDescription>View revenue, expenses, and profit/loss statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="profitloss">Profit/Loss</TabsTrigger>
            </TabsList>
            <TabsContent value="revenue">
              <RevenueReport data={revenueData} />
            </TabsContent>
            <TabsContent value="expenses">
              <ExpenseReport data={expenseData} />
            </TabsContent>
            <TabsContent value="profitloss">
              <ProfitLossReport data={profitLossData} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}