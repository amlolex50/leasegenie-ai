import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Home } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Lease {
  id: string;
  units: {
    properties: {
      name: string;
    };
    unit_name: string;
  };
  monthly_rent: number;
  lease_start_date: string;
  lease_end_date: string;
}

interface LeasesTableProps {
  leases: Lease[];
}

export const LeasesTable = ({ leases }: LeasesTableProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-blue-900">My Leases</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate('/leases/create')}>
          <Home className="mr-2 h-4 w-4" />
          View All Leases
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-gray-100">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Lease Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases?.map((lease) => (
                <TableRow key={lease.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{lease.units.properties.name}</TableCell>
                  <TableCell>{lease.units.unit_name}</TableCell>
                  <TableCell>${lease.monthly_rent}</TableCell>
                  <TableCell>
                    {format(new Date(lease.lease_start_date), 'MMM d, yyyy')} - {format(new Date(lease.lease_end_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/leases/${lease.id}`)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};