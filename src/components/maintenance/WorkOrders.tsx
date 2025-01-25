import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function WorkOrders() {
  const { toast } = useToast();
  const [filter, setFilter] = useState({ status: "all", property: "all" });
  const [search, setSearch] = useState("");

  const { data: workOrders, isLoading, refetch } = useQuery({
    queryKey: ['work-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          contractor:users!contractor_id(*),
          maintenance_request:maintenance_requests (
            *,
            lease:leases (
              unit:units (
                *,
                property:properties (*)
              )
            )
          )
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleCompleteWorkOrder = async (id: string, actualCost: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('work_orders')
        .update({
          status: 'COMPLETED',
          notes: notes,
          actual_completion: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Work order marked as completed",
      });

      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to complete work order",
        variant: "destructive",
      });
    }
  };

  const filteredWorkOrders = workOrders?.filter((order) => {
    const matchesStatus = filter.status === "all" || order.status.toLowerCase() === filter.status.toLowerCase();
    const matchesProperty = filter.property === "all" || order.maintenance_request?.lease?.unit?.property?.id === filter.property;
    const matchesSearch = search === "" || 
      order.notes?.toLowerCase().includes(search.toLowerCase()) ||
      order.contractor?.full_name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesProperty && matchesSearch;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <Select value={filter.status} onValueChange={(value) => setFilter({ ...filter, status: value })}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Search by notes or contractor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-auto md:max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estimated Completion</TableHead>
            <TableHead>Contractor</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorkOrders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.maintenance_request?.lease?.unit?.property?.name}</TableCell>
              <TableCell>{order.maintenance_request?.lease?.unit?.unit_name}</TableCell>
              <TableCell>
                <Badge variant={order.status === "COMPLETED" ? "secondary" : "default"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.estimated_completion}</TableCell>
              <TableCell>{order.contractor?.full_name}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Work Order Details</DialogTitle>
                    </DialogHeader>
                    <Card>
                      <CardHeader>
                        <CardTitle>Work Order Details</CardTitle>
                        <CardDescription>
                          {order.maintenance_request?.lease?.unit?.property?.name} - Unit {order.maintenance_request?.lease?.unit?.unit_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div>
                            <h4 className="font-semibold">Status</h4>
                            <Badge variant={order.status === "COMPLETED" ? "secondary" : "default"}>
                              {order.status}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold">Estimated Completion</h4>
                            <p>{order.estimated_completion}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Contractor</h4>
                            <p>{order.contractor?.full_name}</p>
                            <p>{order.contractor?.email}</p>
                            <p>{order.contractor?.phone}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold">Notes</h4>
                            <p>{order.notes}</p>
                          </div>
                          {order.status !== "COMPLETED" && (
                            <div>
                              <h4 className="font-semibold">Complete Work Order</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label htmlFor="completionNotes">Completion Notes</Label>
                                  <Textarea id="completionNotes" placeholder="Enter completion notes" />
                                </div>
                                <Button onClick={() => {
                                  const notes = (document.getElementById('completionNotes') as HTMLTextAreaElement).value;
                                  handleCompleteWorkOrder(order.id, "", notes);
                                }}>
                                  Mark as Completed
                                </Button>
                              </div>
                            </div>
                          )}
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