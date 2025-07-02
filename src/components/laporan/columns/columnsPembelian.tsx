import { rupiahFormat } from "@/utils/formatting";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";

type TransaksiBeli = {
  no_nota: string;
  tanggal: string;
  total: string;
  dibayar: string;
  sisa_hutang: string;
  status: string;
};

export const columnsPembelian: ColumnDef<TransaksiBeli>[] = [
  {
    accessorKey: "no_nota",
    header: "No Nota",
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) =>
      format(new Date(row.getValue("tanggal")), "dd MMM yyyy", { locale: id }),
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
    accessorKey: "sisa_hutang",
    header: "Sisa Hutang",
    cell: ({ row }) => rupiahFormat(row.getValue("sisa_hutang")),
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
