import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

export const useFinancialData = (reportPeriod: string) => {
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
        .select('amount, created_at, status, category')
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

  return { revenueData, expenseData, profitLossData, loading }
}