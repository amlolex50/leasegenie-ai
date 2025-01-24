import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Unit {
  id: string;
  unit_name: string;
  status: string;
  floor_area: number;
}

interface Property {
  id: string;
  units: Unit[];
}

export const PropertyUnits = ({ property }: { property: Property }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Units</h2>
        <Button onClick={() => navigate(`/properties/${property.id}/units/create`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unit Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Floor Area (sq ft)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {property.units?.map((unit) => (
            <TableRow key={unit.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/properties/${property.id}/units/${unit.id}`)}>
              <TableCell className="font-medium">{unit.unit_name}</TableCell>
              <TableCell>
                <Badge variant={unit.status === 'OCCUPIED' ? 'default' : 'secondary'}>
                  {unit.status}
                </Badge>
              </TableCell>
              <TableCell>{unit.floor_area}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};