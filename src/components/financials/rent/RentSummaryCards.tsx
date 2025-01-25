import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RentData } from "../types"

interface RentSummaryCardsProps {
  rentData: RentData[]
}

export function RentSummaryCards({ rentData }: RentSummaryCardsProps) {
  const totalDue = rentData.reduce((sum, item) => sum + item.amount, 0)
  const totalCollected = rentData
    .filter((item) => item.status === "PAID")
    .reduce((sum, item) => sum + item.amount, 0)
  const totalOverdue = rentData
    .filter((item) => item.status === "OVERDUE")
    .reduce((sum, item) => sum + item.amount, 0)

  return (
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
  )
}