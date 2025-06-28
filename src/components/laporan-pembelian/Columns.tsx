// src/components/laporan-pembelian/Columns.ts
import type { ColumnDef } from "@tanstack/react-table";
import { rupiahFormat } from "@/utils/formatting";

type TransaksiBeli = {
  no_nota: string;
  tanggal: string;
  total: string;
  dibayar: string;
  sisa_hutang: string;
  status: string;
};

export const columns: ColumnDef<TransaksiBeli>[] = [
  {
    accessorKey: "no_nota",
    header: "No Nota",
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
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => rupiahFormat(row.original.total),
  },
  {
    accessorKey: "dibayar",
    header: "Dibayar",
    cell: ({ row }) => rupiahFormat(row.original.dibayar),
  },
  {
    accessorKey: "sisa_hutang",
    header: "Sisa Hutang",
    cell: ({ row }) => rupiahFormat(row.original.sisa_hutang),
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
