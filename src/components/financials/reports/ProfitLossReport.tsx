import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ProfitLossReportProps {
  data: any[]
}

export function ProfitLossReport({ data }: ProfitLossReportProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit/Loss Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
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
            {data.map((item) => (
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
  )
}