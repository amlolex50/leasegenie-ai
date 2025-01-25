import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, FileText } from "lucide-react";

export const LeaseList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: leases, isLoading } = useQuery({
    queryKey: ["leases", filter, search],
    queryFn: async () => {
      let query = supabase
        .from("leases")
        .select(`
          *,
          unit:units(unit_name, property:properties(name)),
          tenant:users(full_name)
        `);

      if (filter === "active") {
        query = query.gte("lease_end_date", new Date().toISOString());
      } else if (filter === "expiring") {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        query = query
          .gte("lease_end_date", new Date().toISOString())
          .lte("lease_end_date", thirtyDaysFromNow.toISOString());
      } else if (filter === "expired") {
        query = query.lt("lease_end_date", new Date().toISOString());
      }

      if (search) {
        query = query.or(`tenant.full_name.ilike.%${search}%,unit.property.name.ilike.%${search}%,unit.unit_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by tenant, property, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter leases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leases</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : leases?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No leases found
                </TableCell>
              </TableRow>
            ) : (
              leases?.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell>{lease.tenant.full_name}</TableCell>
                  <TableCell>{lease.unit.property.name}</TableCell>
                  <TableCell>{lease.unit.unit_name}</TableCell>
                  <TableCell>{format(new Date(lease.lease_start_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(lease.lease_end_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>${lease.monthly_rent.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(lease.lease_end_date) < new Date()
                      ? "Expired"
                      : new Date(lease.lease_end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? "Expiring Soon"
                      : "Active"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/leases/${lease.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};