// src/components/berang/Columns.tsx
import { ArrowUpDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import type { Barang } from "./types";

type Barang = {
  id: string;
  nama_barang: string;
  kategori_id: string;
  kode_barang: string;
  keterangan: string;
  nama_kategori?: string;
};

export const columns = (
  handleEdit: (barang: Barang) => void,
  handleDelete: (id: string) => void,
  handleKelolaSatuan: (id: string) => void
): ColumnDef<Barang>[] => [
  {
    accessorKey: "nama_barang",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Nama
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "nama_kategori",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => {
          column.toggleSorting(column.getIsSorted() === "asc");
        }}
      >
        Kategori
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "kode_barang",
    header: "Kode",
  },
  {
    accessorKey: "keterangan",
    header: "Keterangan",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const barang = row.original;

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(barang)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(barang.id)}
          >
            Hapus
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleKelolaSatuan(barang.id)}
          >
            Lihat Satuan
          </Button>
        </div>
      );
    },
  },
];
