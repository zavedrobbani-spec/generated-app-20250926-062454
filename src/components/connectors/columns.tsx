"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Connector, ConnectorStatus } from "@shared/types";
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
import { cn } from "@/lib/utils";
import { useConnectorStore } from "@/stores/connector-store";
const statusBadge = ({ status }: { status: ConnectorStatus }) => {
  const statusConfig = {
    [ConnectorStatus.UP]: {
      text: "Up",
      icon: <Icons.power className="mr-1 h-3 w-3" />,
      className: "bg-green-500 hover:bg-green-500/80 text-white",
    },
    [ConnectorStatus.DOWN]: {
      text: "Down",
      icon: <Icons.powerOff className="mr-1 h-3 w-3" />,
      className: "bg-red-500 hover:bg-red-500/80 text-white",
    },
    [ConnectorStatus.RECONNECTING]: {
      text: "Reconnecting",
      icon: <Icons.activity className="mr-1 h-3 w-3 animate-pulse" />,
      className: "bg-yellow-500 hover:bg-yellow-500/80 text-white",
    },
  };
  const config = statusConfig[status];
  return (
    <Badge className={cn("flex items-center w-fit", config.className)}>
      {config.icon}
      {config.text}
    </Badge>
  );
};
const actionsCell = ({ connector }: { connector: Connector }) => {
  const setSelectedConnector = useConnectorStore(
    (state) => state.setSelectedConnector
  );
  const setDeleteDialogOpen = useConnectorStore(
    (state) => state.setDeleteDialogOpen
  );
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
        <DropdownMenuItem onClick={() => setSelectedConnector(connector)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>Start</DropdownMenuItem>
        <DropdownMenuItem>Stop</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
          onClick={() => {
            setSelectedConnector(connector);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export const columns: ColumnDef<Connector>[] = [
  {
    accessorKey: "cid",
    header: "CID",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="outline">{row.original.type.toUpperCase()}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => statusBadge({ status: row.original.status }),
  },
  {
    accessorKey: "submit_sm_throughput",
    header: "Throughput",
    cell: ({ row }) => `${row.original.submit_sm_throughput} MPS`,
  },
  {
    accessorKey: "starts",
    header: "Starts",
  },
  {
    accessorKey: "stops",
    header: "Stops",
  },
  {
    id: "actions",
    cell: ({ row }) => actionsCell({ connector: row.original }),
  },
];