// src/components/user/columns.tsx
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "./types";

export const Columns = (
  handleResetPassword: (userId: string) => void,
  handleDelete?: (id: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "role",
    header: "Peran",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          {handleResetPassword && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleResetPassword(user.id)}
            >
              Reset Password
            </Button>
          )}
          {handleDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(user.id)}
            >
              Hapus
            </Button>
          )}
        </div>
      );
    },
  },
];
