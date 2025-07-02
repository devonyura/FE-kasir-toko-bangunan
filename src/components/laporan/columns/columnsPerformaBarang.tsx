import { rupiahFormat } from "@/utils/formatting";
import type { ColumnDef } from "@tanstack/react-table";

export type PerformaBarang = {
  nama_barang: string;
  total_qty: string;
  total_penjualan: string;
};

export const columnsPerformaBarang: ColumnDef<PerformaBarang>[] = [
  {
    accessorKey: "nama_barang",
    header: "Nama Barang",
  },
  {
    accessorKey: "total_qty",
    header: "Qty Terjual",
  },
  {
    accessorKey: "total_penjualan",
    header: "Total Penjualan",
    cell: ({ row }) => rupiahFormat(row.getValue("total_penjualan")),
  },
];
