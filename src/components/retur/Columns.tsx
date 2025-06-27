import { rupiahFormat } from "@/utils/formatting";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // jika kamu pakai util classnames

export const columns: ColumnDef<unknown>[] = [
  {
    accessorKey: "tanggal",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tanggal & Waktu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const raw = row.getValue("tanggal") as string;
      const date = new Date(raw);
      if (isNaN(date.getTime())) return "-";
      return format(date, "EEEE, dd MMMM yyyy", { locale: id });
    },
  },
  {
    accessorKey: "jenis",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Jenis
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "nama_barang",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Barang
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "nama_satuan",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Satuan
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "qty",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stok
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const qty = row.getValue("qty") as number;
      const jenis = row.original.jenis as string;

      const isPenjualan = jenis === "penjualan";

      const sign = isPenjualan ? "+" : "-";
      const color = isPenjualan ? "text-green-600" : "text-red-600";

      return (
        <span className={cn("font-medium", color)}>
          {sign}
          {qty}
        </span>
      );
    },
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sub Total
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => rupiahFormat(row.getValue("subtotal")),
  },
  {
    accessorKey: "alasan",
    header: "Alasan Retur",
  },
];
