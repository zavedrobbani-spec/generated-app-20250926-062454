"use client";
import { ColumnDef } from "@tanstack/react-table";
import { JasminUser } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { useUserStore } from "@/stores/user-store";
export const userColumns: ColumnDef<JasminUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "gid",
    header: "Group",
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "throughput",
    header: "Throughput",
  },
  {
    accessorKey: "enabled",
    header: "Status",
    cell: ({ row }) => {
      const isEnabled = row.original.enabled;
      return (
        <Badge variant={isEnabled ? "default" : "destructive"} className={isEnabled ? "bg-green-500" : ""}>
          {isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { setSelectedUser, setUserDeleteDialogOpen } = useUserStore();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.moreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
              onClick={() => {
                setSelectedUser(user);
                setUserDeleteDialogOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];