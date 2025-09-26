"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MessageFilter, FilterType } from "@shared/types";
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
import { useFilterStore } from "@/stores/filter-store";
import { cn } from "@/lib/utils";
const TypeBadge = ({ type }: { type: FilterType }) => {
  const typeConfig: { [key in FilterType]: string } = {
    [FilterType.USER_FILTER]: "bg-blue-500",
    [FilterType.GROUP_FILTER]: "bg-indigo-500",
    [FilterType.SOURCE_ADDR_FILTER]: "bg-purple-500",
    [FilterType.DESTINATION_ADDR_FILTER]: "bg-pink-500",
    [FilterType.SHORT_MESSAGE_FILTER]: "bg-red-500",
    [FilterType.TRANSPARENT_FILTER]: "bg-gray-500",
  };
  return (
    <Badge className={cn("text-white", typeConfig[type])}>
      {type}
    </Badge>
  );
};
export const filterColumns: ColumnDef<MessageFilter>[] = [
  {
    accessorKey: "fid",
    header: "Filter ID (FID)",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeBadge type={row.original.type} />,
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "routes",
    header: "Routes",
    cell: ({ row }) => {
      const routes = row.original.routes;
      if (!routes || routes.length === 0) {
        return <span className="text-muted-foreground">Any</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {routes.map((route) => (
            <Badge key={route} variant="secondary">Order {route}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell filter={row.original} />,
  },
];

const ActionsCell = ({ filter }: { filter: MessageFilter }) => {
  const { setSelectedFilter, setDeleteDialogOpen } = useFilterStore();
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
        <DropdownMenuItem onClick={() => setSelectedFilter(filter)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
          onClick={() => {
            setSelectedFilter(filter);
            setDeleteDialogOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};