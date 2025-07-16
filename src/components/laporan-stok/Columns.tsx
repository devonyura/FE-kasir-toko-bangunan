// src/components/laporan-stok/Columns.tsx

import type { ColumnDef } from "@tanstack/react-table";
import { rupiahFormat } from "@/utils/formatting";

type LaporanStok = {
  nama_lengkap: string;
  jumlah: number;
  nama_kategori: string;
  harga_beli: number;
  harga_jual: number;
  total_aset: number;
};

export const columns: ColumnDef<LaporanStok>[] = [
  {
    accessorKey: "nama_lengkap",
    header: "Nama Barang",
  },
  {
    accessorKey: "nama_kategori",
    header: "Kategori",
  },
  {
    accessorKey: "jumlah",
    header: "Jumlah",
  },
  {
    accessorKey: "harga_beli",
    header: "Harga Beli",
    cell: ({ row }) => rupiahFormat(row.original.harga_beli),
  },
  {
    accessorKey: "harga_jual",
    header: "Harga Jual",
    cell: ({ row }) => rupiahFormat(row.original.harga_jual),
  },
  {
    accessorKey: "total_aset",
    header: "Total Aset",
    cell: ({ row }) => rupiahFormat(row.original.total_aset),
  },
];
