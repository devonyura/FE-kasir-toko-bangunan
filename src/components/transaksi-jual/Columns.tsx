// src/components/transaksi-jual/Columns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import type { TransaksiJual } from "./types";
import { Button } from "@/components/ui/button";

export const columns = (
  handlePelunasan: (transaksi: TransaksiJual) => void,
  handlePrint: (transaksi: TransaksiJual) => void
): ColumnDef<TransaksiJual>[] => [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
  },
  {
    accessorKey: "customer",
    header: "Customer",
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
    accessorKey: "sisa_piutang",
    header: "Sisa Piutang",
    cell: ({ row }) =>
      `Rp${parseFloat(row.getValue("sisa_piutang")).toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
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
          {transaksi.status === "Piutang" && (
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
