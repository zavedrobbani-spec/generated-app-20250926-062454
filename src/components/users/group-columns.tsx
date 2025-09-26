"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Group } from "@shared/types";
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
export const groupColumns: ColumnDef<Group>[] = [
  {
    accessorKey: "gid",
    header: "Group ID (GID)",
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
      const ActionsCell = ({ group }: { group: Group }) => {
        const { setSelectedGroup, setGroupDeleteDialogOpen } = useUserStore();
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
              <DropdownMenuItem onClick={() => setSelectedGroup(group)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                onClick={() => {
                  setSelectedGroup(group);
                  setGroupDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };
      return <ActionsCell group={row.original} />;
    },
  },
];