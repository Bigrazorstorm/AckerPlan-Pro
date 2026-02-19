import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { machinery } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";

export default function MachineryPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Operational':
        return 'success';
      case 'Maintenance Due':
        return 'warning';
      case 'In Workshop':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Machinery</CardTitle>
          <CardDescription>
            Manage your fleet of tractors, harvesters, and other equipment.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Machine
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Service</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machinery.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">{machine.name}</TableCell>
                <TableCell>{machine.type}</TableCell>
                <TableCell>
                  <Badge variant={
                    machine.status === 'Operational' ? 'default' 
                    : machine.status === 'Maintenance Due' ? 'destructive' 
                    : 'secondary'
                  } 
                  className={
                    machine.status === 'Operational' ? 'bg-green-100 text-green-800' 
                    : machine.status === 'Maintenance Due' ? 'bg-yellow-100 text-yellow-800'
                    : machine.status === 'In Workshop' ? 'bg-red-100 text-red-800'
                    : ''
                  }>
                    {machine.status}
                  </Badge>
                </TableCell>
                <TableCell>{machine.nextService}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Maintenance</DropdownMenuItem>
                      <DropdownMenuItem>Report Repair</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
