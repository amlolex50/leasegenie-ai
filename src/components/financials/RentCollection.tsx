"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { RentData, PaymentResponse } from "./types"
import { RentSummaryCards } from "./rent/RentSummaryCards"
import { RentTable } from "./rent/RentTable"

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
          amount,
          status,
          lease:leases (
            tenant:users!fk_leases_tenant (
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <RentSummaryCards rentData={rentData} />
      <Card>
        <CardHeader>
          <CardTitle>Rent Collection Overview</CardTitle>
          <CardDescription>Monthly rent due, collected, and overdue for all properties</CardDescription>
        </CardHeader>
        <CardContent>
          <RentTable rentData={rentData} onPayment={handlePayment} />
        </CardContent>
      </Card>
    </div>
  )
}