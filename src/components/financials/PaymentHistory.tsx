"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ lease: "all", property: "all" })
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  const fetchPaymentHistory = async () => {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          lease:leases (
            id,
            tenant:users!leases_tenant_id_fkey (
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
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedData = payments.map(payment => ({
        id: payment.id,
        lease: payment.lease.id,
        property: payment.lease.unit.property.name,
        unit: payment.lease.unit.unit_name,
        tenant: payment.lease.tenant.full_name,
        date: payment.paid_date || payment.due_date,
        amount: payment.amount,
        method: payment.payment_method || 'N/A',
        status: payment.status
      }))

      setPaymentHistory(formattedData)
    } catch (error) {
      console.error('Error fetching payment history:', error)
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesLease = filter.lease === "all" || payment.lease === filter.lease
    const matchesProperty = filter.property === "all" || payment.property === filter.property
    const matchesSearch =
      payment.tenant.toLowerCase().includes(search.toLowerCase()) ||
      payment.unit.toLowerCase().includes(search.toLowerCase())
    return matchesLease && matchesProperty && matchesSearch
  })

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View and manage payment records for all leases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
            <Select value={filter.lease} onValueChange={(value) => setFilter({ ...filter, lease: value })}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by lease" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leases</SelectItem>
                <SelectItem value="L001">L001</SelectItem>
                <SelectItem value="L002">L002</SelectItem>
                <SelectItem value="L003">L003</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.property} onValueChange={(value) => setFilter({ ...filter, property: value })}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="Skyline Tower">Skyline Tower</SelectItem>
                <SelectItem value="Harbor Point Mall">Harbor Point Mall</SelectItem>
                <SelectItem value="Tech Park One">Tech Park One</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Search by tenant or unit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-auto md:max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lease</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.lease}</TableCell>
                <TableCell>{payment.property}</TableCell>
                <TableCell>{payment.unit}</TableCell>
                <TableCell>{payment.tenant}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Badge variant={payment.status === "PAID" ? "default" : "destructive"}>{payment.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}