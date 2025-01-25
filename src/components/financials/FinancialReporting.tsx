"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function FinancialReporting() {
  const [reportPeriod, setReportPeriod] = useState("monthly")
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [expenseData, setExpenseData] = useState<any[]>([])
  const [profitLossData, setProfitLossData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchFinancialData()
  }, [reportPeriod])

  const fetchFinancialData = async () => {
    try {
      // Fetch revenue data (payments)
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('amount, paid_date, status')
        .eq('status', 'PAID')

      if (paymentsError) throw paymentsError

      // Fetch expense data (invoices)
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('amount, created_at, status')
        .eq('status', 'PAID')

      if (invoicesError) throw invoicesError

      // Process revenue data
      const revenueByMonth = processRevenueData(payments)
      setRevenueData(revenueByMonth)

      // Process expense data
      const expensesByCategory = processExpenseData(invoices)
      setExpenseData(expensesByCategory)

      // Calculate profit/loss
      const profitLossByMonth = calculateProfitLoss(revenueByMonth, invoices)
      setProfitLossData(profitLossByMonth)

    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({
        title: "Error",
        description: "Failed to load financial reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processRevenueData = (payments: any[]) => {
    // Group payments by month
    const monthlyRevenue = payments.reduce((acc, payment) => {
      const month = new Date(payment.paid_date).toLocaleString('default', { month: 'short' })
      acc[month] = (acc[month] || 0) + payment.amount
      return acc
    }, {})

    return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue
    }))
  }

  const processExpenseData = (invoices: any[]) => {
    // Group expenses by category
    return [
      { category: "Maintenance", amount: calculateTotalByCategory(invoices, 'maintenance') },
      { category: "Utilities", amount: calculateTotalByCategory(invoices, 'utilities') },
      { category: "Insurance", amount: calculateTotalByCategory(invoices, 'insurance') },
      { category: "Property Tax", amount: calculateTotalByCategory(invoices, 'tax') },
      { category: "Staff", amount: calculateTotalByCategory(invoices, 'staff') },
    ]
  }

  const calculateTotalByCategory = (invoices: any[], category: string) => {
    return invoices
      .filter(invoice => invoice.category === category)
      .reduce((sum, invoice) => sum + invoice.amount, 0)
  }

  const calculateProfitLoss = (revenueData: any[], expenses: any[]) => {
    // Calculate monthly profit/loss
    return revenueData.map(({ month, revenue }) => {
      const monthExpenses = expenses
        .filter(exp => {
          const expMonth = new Date(exp.created_at).toLocaleString('default', { month: 'short' })
          return expMonth === month
        })
        .reduce((sum, exp) => sum + exp.amount, 0)

      return {
        month,
        revenue,
        expenses: monthExpenses,
        profit: revenue - monthExpenses
      }
    })
  }

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
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueData.map((item) => (
                        <TableRow key={item.month}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>${item.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="expenses">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseData.map((item) => (
                        <TableRow key={item.category}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profitloss">
              <Card>
                <CardHeader>
                  <CardTitle>Profit/Loss Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={profitLossData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" />
                      <Bar dataKey="expenses" fill="#82ca9d" />
                      <Bar dataKey="profit" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Expenses</TableHead>
                        <TableHead>Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profitLossData.map((item) => (
                        <TableRow key={item.month}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>${item.revenue.toLocaleString()}</TableCell>
                          <TableCell>${item.expenses.toLocaleString()}</TableCell>
                          <TableCell>${item.profit.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}