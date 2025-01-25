import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { RentData } from "../types"
import { PaymentDialog } from "./PaymentDialog"

interface RentTableProps {
  rentData: RentData[]
  onPayment: (id: string) => void
}

export function RentTable({ rentData, onPayment }: RentTableProps) {
  return (
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
                  item.status === "PAID" ? "default" : "destructive"
                }
              >
                {item.status}
              </Badge>
            </TableCell>
            <TableCell>
              {item.status !== "PAID" && (
                <PaymentDialog 
                  amount={item.amount}
                  onConfirm={() => onPayment(item.id)}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}