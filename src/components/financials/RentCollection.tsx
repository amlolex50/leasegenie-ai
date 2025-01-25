import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for rent collection
const mockRentData = [
  {
    id: 1,
    property: "Skyline Tower",
    unit: "101",
    tenant: "TechCorp Inc.",
    dueDate: "2023-06-01",
    amount: 5000,
    status: "Paid",
  },
  {
    id: 2,
    property: "Harbor Point Mall",
    unit: "201",
    tenant: "Retail Giants",
    dueDate: "2023-06-01",
    amount: 7500,
    status: "Overdue",
  },
  {
    id: 3,
    property: "Tech Park One",
    unit: "301",
    tenant: "StartUp Hub",
    dueDate: "2023-06-01",
    amount: 6000,
    status: "Pending",
  },
]

export function RentCollection() {
  const [rentData, setRentData] = useState(mockRentData)

  const totalDue = rentData.reduce((sum, item) => sum + item.amount, 0)
  const totalCollected = rentData.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0)
  const totalOverdue = rentData.filter((item) => item.status === "Overdue").reduce((sum, item) => sum + item.amount, 0)

  const handlePayment = (id: number) => {
    setRentData(rentData.map((item) => (item.id === id ? { ...item, status: "Paid" } : item)))
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rent Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalDue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">For current month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rent Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalCollected / totalDue) * 100).toFixed(1)}% of total due
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalOverdue / totalDue) * 100).toFixed(1)}% of total due
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rent Collection Overview</CardTitle>
          <CardDescription>Monthly rent due, collected, and overdue for all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.property}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.tenant}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>${item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "Paid" ? "success" : item.status === "Overdue" ? "destructive" : "default"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status !== "Paid" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Record Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                Amount
                              </Label>
                              <Input id="amount" defaultValue={item.amount} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="method" className="text-right">
                                Payment Method
                              </Label>
                              <Select>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="credit_card">Credit Card</SelectItem>
                                  <SelectItem value="check">Check</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={() => handlePayment(item.id)}>Confirm Payment</Button>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
