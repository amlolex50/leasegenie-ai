import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { maintenanceService } from "@/services/maintenanceService";

export function MaintenanceRequestList() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenanceRequests'],
    queryFn: maintenanceService.getMaintenanceRequests,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.description}</TableCell>
            <TableCell>
              <Badge variant={request.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                {request.priority}
              </Badge>
            </TableCell>
            <TableCell>{request.status}</TableCell>
            <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}