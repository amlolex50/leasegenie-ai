import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for financial reports
const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 55000 },
  { month: "Mar", revenue: 60000 },
  { month: "Apr", revenue: 58000 },
  { month: "May", revenue: 62000 },
  { month: "Jun", revenue: 65000 },
]

const expenseData = [
  { category: "Maintenance", amount: 15000 },
  { category: "Utilities", amount: 10000 },
  { category: "Insurance", amount: 5000 },
  { category: "Property Tax", amount: 12000 },
  { category: "Staff", amount: 20000 },
]

const profitLossData = [
  { month: "Jan", revenue: 50000, expenses: 40000, profit: 10000 },
  { month: "Feb", revenue: 55000, expenses: 42000, profit: 13000 },
  { month: "Mar", revenue: 60000, expenses: 45000, profit: 15000 },
  { month: "Apr", revenue: 58000, expenses: 44000, profit: 14000 },
  { month: "May", revenue: 62000, expenses: 46000, profit: 16000 },
  { month: "Jun", revenue: 65000, expenses: 48000, profit: 17000 },
]

export function FinancialReporting() {
  const [reportPeriod, setReportPeriod] = useState("monthly")

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
