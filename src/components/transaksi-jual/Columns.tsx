// import { rupiahFormat } from "@/utils/formatting";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
// import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils"; // jika kamu pakai util classnames
import type { TransaksiJual } from "@/components/transaksi-jual/types";

export const columns = (
  handlePelunasan: (transaksi: TransaksiJual) => void,
  handlePrint: (transaksi: TransaksiJual) => void
): ColumnDef<TransaksiJual>[] => [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => {
      const raw = row.getValue("tanggal") as string;
      const date = new Date(raw);
      if (isNaN(date.getTime())) return "-";
      return format(date, "EEEE, dd MMMM yyyy [HH:ii]", { locale: id });
    },
  },
  {
    accessorKey: "no_nota",
    header: "No Nota",
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
    accessorKey: "diskon",
    header: "Diskon",
    cell: ({ row }) =>
      `Rp${parseFloat(row.getValue("diskon")).toLocaleString()}`,
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
