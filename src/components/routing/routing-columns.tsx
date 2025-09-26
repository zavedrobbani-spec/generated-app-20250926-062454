"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Route, RouteType } from "@shared/types";
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
import { useRoutingStore } from "@/stores/routing-store";
import { useConnectorStore } from "@/stores/connector-store";
import { cn } from "@/lib/utils";
export const TypeBadge = ({ type }: { type: RouteType }) => {
  const typeConfig = {
    [RouteType.STATIC]: "bg-blue-500",
    [RouteType.STANDARD]: "bg-purple-500",
    [RouteType.FAILOVER]: "bg-orange-500",
    [RouteType.RANDOM]: "bg-teal-500",
  };
  return (
    <Badge className={cn("text-white", typeConfig[type])}>
      {type}
    </Badge>
  );
};
const ConnectorCell = ({ connectorId }: { connectorId: string }) => {
  const connectors = useConnectorStore((state) => state.connectors);
  const connector = connectors.find((c) => c.id === connectorId);
  return connector ? (
    <Badge variant="outline">{connector.cid}</Badge>
  ) : (
    "N/A"
  );
};
export const ActionsCell = ({ route }: { route: Route }) => {
  const { setSelectedRoute, setDeleteDialogOpen } = useRoutingStore();
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
        <DropdownMenuItem onClick={() => setSelectedRoute(route)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
          onClick={() => {
            setSelectedRoute(route);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
// biome-ignore lint/security/noBannedJsxPragma: <explanation>
// eslint-disable-next-line react-refresh/only-export-components
export const routingColumns: ColumnDef<Route>[] = [
  {
    accessorKey: "order",
    header: "Order",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "connectorId",
    header: "Connector",
    cell: ({ row }) => <ConnectorCell connectorId={row.original.connectorId} />,
  },
  {
    accessorKey: "filters",
    header: "Filters",
    cell: ({ row }) => {
      const filters = row.original.filters;
      if (!filters || filters.length === 0) {
        return <span className="text-muted-foreground">None</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {filters.map((filter) => (
            <Badge key={filter} variant="secondary">{filter}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell route={row.original} />,
  },
];