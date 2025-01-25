"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface RentData {
  id: string
  property: string
  unit: string
  tenant: string
  dueDate: string
  amount: number
  status: string
}

interface PaymentResponse {
  id: string
  lease: {
    tenant: {
      full_name: string
    }
    unit: {
      unit_name: string
      property: {
        name: string
      }
    }
  }
  due_date: string
  amount: number
  status: string
}

export function RentCollection() {
  const [rentData, setRentData] = useState<RentData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRentData()
  }, [])

  const fetchRentData = async () => {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          id,
          due_date,
          amount,
          status,
          lease:leases (
            tenant:users (
              full_name
            ),
            unit:units (
              unit_name,
              property:properties (
                name
              )
            )
          )
        `)
        .order('due_date', { ascending: false })

      if (error) throw error

      const formattedData: RentData[] = (payments as PaymentResponse[]).map(payment => ({
        id: payment.id,
        property: payment.lease.unit.property.name,
        unit: payment.lease.unit.unit_name,
        tenant: payment.lease.tenant.full_name,
        dueDate: payment.due_date,
        amount: payment.amount,
        status: payment.status
      }))

      setRentData(formattedData)
    } catch (error) {
      console.error('Error fetching rent data:', error)
      toast({
        title: "Error",
        description: "Failed to load rent collection data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: 'PAID',
          paid_date: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      })

      fetchRentData()
    } catch (error) {
      console.error('Error recording payment:', error)
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      })
    }
  }

  const totalDue = rentData.reduce((sum, item) => sum + item.amount, 0)
  const totalCollected = rentData
    .filter((item) => item.status === "PAID")
    .reduce((sum, item) => sum + item.amount, 0)
  const totalOverdue = rentData
    .filter((item) => item.status === "OVERDUE")
    .reduce((sum, item) => sum + item.amount, 0)

  if (loading) {
    return <div>Loading...</div>
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
                        item.status === "PAID" ? "success" : item.status === "OVERDUE" ? "destructive" : "default"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status !== "PAID" && (
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