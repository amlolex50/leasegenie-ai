import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type LeaseAbstraction = {
  id: string
  property: string
  tenant: string
  startDate: string
  endDate: string
  monthlyRent: string
  securityDeposit: string
  keyTerms: string[]
}

const mockLeaseAbstractions: LeaseAbstraction[] = [
  {
    id: "1",
    property: "Skyline Tower",
    tenant: "TechCorp Inc.",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    monthlyRent: "$5,000",
    securityDeposit: "$10,000",
    keyTerms: [
      "Rent increases by 3% annually",
      "Tenant responsible for utilities",
      "No subletting without landlord approval",
      "Option to renew for 2 additional years",
    ],
  },
  {
    id: "2",
    property: "Harbor Point Mall",
    tenant: "Retail Giants",
    startDate: "2023-03-15",
    endDate: "2028-03-14",
    monthlyRent: "$7,500",
    securityDeposit: "$15,000",
    keyTerms: [
      "Percentage rent: 5% of gross sales over $1,000,000",
      "Tenant responsible for common area maintenance fees",
      "Exclusive use clause for department store",
      "Right of first refusal for adjacent spaces",
    ],
  },
]

export function AIInsights() {
  const [leaseAbstractions] = useState<LeaseAbstraction[]>(mockLeaseAbstractions)

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
        <CardDescription>Automated lease abstraction and key term summaries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Lease Period</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaseAbstractions.map((lease) => (
              <TableRow key={lease.id}>
                <TableCell>{lease.property}</TableCell>
                <TableCell>{lease.tenant}</TableCell>
                <TableCell>{`${lease.startDate} to ${lease.endDate}`}</TableCell>
                <TableCell>{lease.monthlyRent}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {lease.property} - {lease.tenant}
                        </DialogTitle>
                        <DialogDescription>Lease abstraction details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">Start Date:</span>
                          <span className="col-span-3">{lease.startDate}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">End Date:</span>
                          <span className="col-span-3">{lease.endDate}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">Monthly Rent:</span>
                          <span className="col-span-3">{lease.monthlyRent}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">Security Deposit:</span>
                          <span className="col-span-3">{lease.securityDeposit}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <span className="font-bold">Key Terms:</span>
                          <ul className="list-disc pl-5 col-span-3">
                            {lease.keyTerms.map((term, index) => (
                              <li key={index}>{term}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Button>Upload New Lease</Button>
        </div>
      </CardContent>
    </Card>
  )
}