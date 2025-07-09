// src/pages/transaksi/Columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import type { TransaksiBeli } from "./types";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const columns = (
  handlePelunasan: (transaksi: TransaksiBeli) => void,
  handlePrint: (transaksi: TransaksiBeli) => void
): ColumnDef<TransaksiBeli>[] => [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => {
      const raw = row.getValue("tanggal") as string;
      const date = new Date(raw);
      if (isNaN(date.getTime())) return "-";
      return format(date, "EEEE, dd MMMM yyyy", { locale: id });
    },
  },
  {
    accessorKey: "no_nota",
    header: "No Nota",
  },
  {
    accessorKey: "nama_supplier",
    header: "Supplier",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) =>
      `Rp${parseFloat(row.getValue("total")).toLocaleString()}`,
  },
  {
    accessorKey: "dibayar",
    header: "Dibayar",
    cell: ({ row }) =>
      `Rp${parseFloat(row.getValue("dibayar")).toLocaleString()}`,
  },
  {
    accessorKey: "sisa_hutang",
    header: "Sisa Hutang",
    cell: ({ row }) =>
      `Rp${parseFloat(row.getValue("sisa_hutang")).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={
            status === "Lunas"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "jatuh_tempo",
    header: "jatuh tempo",
    cell: ({ row }) => {
      const raw = row.getValue("jatuh_tempo") as string;
      const date = new Date(raw);
      if (isNaN(date.getTime())) return "-";
      return format(date, "EEEE, dd MMMM", { locale: id });
    },
  },
  {
    accessorKey: "username",
    header: "User",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const transaksi = row.original;
      return (
        <div className="flex gap-2">
          {transaksi.status === "Hutang" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => handlePelunasan(transaksi)}
            >
              Pelunasan
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlePrint(transaksi)}
          >
            Cetak Nota
          </Button>
        </div>
      );
    },
  },
];
