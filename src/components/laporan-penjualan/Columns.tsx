import { rupiahFormat } from "@/utils/formatting";
import type { ColumnDef } from "@tanstack/react-table";

type TransaksiJual = {
  no_nota: string;
  tanggal: string;
  customer: string;
  total: string;
  dibayar: string;
  status: string;
};

export const columns: ColumnDef<TransaksiJual>[] = [
  {
    accessorKey: "no_nota",
    header: "No. Nota",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => {
      const raw = row.getValue("tanggal");
      const date = new Date(raw);
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `${rupiahFormat(row.getValue("total"))}`,
  },
  {
    accessorKey: "dibayar",
    header: "Dibayar",
    cell: ({ row }) => `${rupiahFormat(row.getValue("dibayar"))}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <span
          className={`font-semibold ${
            status === "Lunas" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
