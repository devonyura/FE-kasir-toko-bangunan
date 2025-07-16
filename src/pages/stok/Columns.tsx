// src/pages/stok/Columns.tsx
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";

export type Stok = {
  barang_id: string;
  nama_barang: string;
  kategori: string;
  satuan_id: string;
  nama_satuan: string;
  jumlah: number;
  id: string;
};

export const columns = (
  handleDetail: (id: string, nama_barang: string) => void
): ColumnDef<Stok>[] => [
    {
      accessorKey: "nama_barang",
      header: "Nama Barang",
    },
    {
      accessorKey: "nama_tipe",
      header: "Tipe",
    },
    {
      accessorKey: "nama_kategori",
      header: "Kategori",
    },
    {
      accessorKey: "jumlah",
      header: "Jumlah",
      cell: ({ row }) => {
        const jumlah = row.getValue("jumlah") as number;
        return (
          <span
            className={
              jumlah <= 0
                ? "text-red-500 font-semibold"
                : jumlah <= 10
                  ? "text-yellow-600 font-medium"
                  : "text-green-600"
            }
          >
            {jumlah}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleDetail(row.original.id, row.original.nama_barang)
            }
          >
            Detail
          </Button>
        );
      },
    },
  ];
