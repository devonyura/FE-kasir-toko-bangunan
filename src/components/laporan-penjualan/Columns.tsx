import { rupiahFormat } from "@/utils/formatting";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type TransaksiJual = {
  no_nota: string;
  tanggal: string;
  customer: string;
  total: string;
  dibayar: string;
  status: string;
};

export const columns: ColumnDef<TransaksiJual>[] = [
  {
    accessorKey: "no_nota",
    header: "No. Nota",
  },
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
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `${rupiahFormat(row.getValue("total"))}`,
  },
  {
    accessorKey: "dibayar",
    header: "Dibayar",
    cell: ({ row }) => `${rupiahFormat(row.getValue("dibayar"))}`,
  },
  {
    accessorKey: "sisa_piutang",
    header: "Sisa Piutang",
    cell: ({ row }) => `${rupiahFormat(row.getValue("sisa_piutang"))}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
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
