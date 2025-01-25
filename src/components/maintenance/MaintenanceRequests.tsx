import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function MaintenanceRequests() {
  const [filter, setFilter] = useState({ priority: "all", property: "all", status: "all" });
  const [search, setSearch] = useState("");

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          lease:leases (
            unit:units (
              *,
              property:properties (*)
            ),
            tenant:users (*)
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const filteredRequests = requests?.filter((request) => {
    const matchesPriority = filter.priority === "all" || request.priority.toLowerCase() === filter.priority.toLowerCase();
    const matchesProperty = filter.property === "all" || request.lease?.unit?.property?.id === filter.property;
    const matchesStatus = filter.status === "all" || request.status.toLowerCase() === filter.status.toLowerCase();
    const matchesSearch = search === "" || 
      request.description.toLowerCase().includes(search.toLowerCase()) ||
      request.lease?.unit?.unit_name.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesProperty && matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <Select value={filter.priority} onValueChange={(value) => setFilter({ ...filter, priority: value })}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by description or unit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-auto md:max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests?.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.description}</TableCell>
              <TableCell>{request.lease?.unit?.property?.name}</TableCell>
              <TableCell>{request.lease?.unit?.unit_name}</TableCell>
              <TableCell>
                <Badge variant={request.priority === "HIGH" ? "destructive" : "secondary"}>
                  {request.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "OPEN" ? "outline" : 
                    request.status === "IN_PROGRESS" ? "default" : 
                    "secondary"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Maintenance Request Details</DialogTitle>
                    </DialogHeader>
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                        <CardDescription>
                          {request.lease?.unit?.property?.name} - Unit {request.lease?.unit?.unit_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div>
                            <h4 className="font-semibold">Description</h4>
                            <p>{request.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Priority</h4>
                            <Badge variant={request.priority === "HIGH" ? "destructive" : "secondary"}>
                              {request.priority}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold">Status</h4>
                            <Badge
                              variant={
                                request.status === "OPEN" ? "outline" : 
                                request.status === "IN_PROGRESS" ? "default" : 
                                "secondary"
                              }
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold">Date Submitted</h4>
                            <p>{new Date(request.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Tenant Contact</h4>
                            <p>{request.lease?.tenant?.full_name}</p>
                            <p>{request.lease?.tenant?.email}</p>
                            <p>{request.lease?.tenant?.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}