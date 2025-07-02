// Laporan Penjualan
import { rupiahFormat } from "@/utils/formatting";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";

type TransaksiJual = {
  no_nota: string;
  tanggal: string;
  customer: string;
  total: string;
  dibayar: string;
  status: string;
};

export const columnsPenjualan: ColumnDef<TransaksiJual>[] = [
  {
    accessorKey: "no_nota",
    header: "No Nota",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) =>
      format(new Date(row.getValue("tanggal")), "dd MMM yyyy HH:mm", {
        locale: id,
      }),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => rupiahFormat(row.getValue("total")),
  },
  {
    accessorKey: "dibayar",
    header: "Dibayar",
    cell: ({ row }) => rupiahFormat(row.getValue("dibayar")),
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
