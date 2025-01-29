import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface WorkOrder {
  id: string;
  maintenance_requests: {
    description: string;
    leases: {
      units: {
        unit_name: string;
        properties: {
          name: string;
        };
      };
    };
  };
  status: string;
  estimated_completion: string;
}

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
}

export const WorkOrdersTable = ({ workOrders }: WorkOrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Property</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workOrders?.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              {order.maintenance_requests?.leases?.units?.properties?.name} - {order.maintenance_requests?.leases?.units?.unit_name}
            </TableCell>
            <TableCell>{order.maintenance_requests?.description}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.estimated_completion}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">Update Status</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};