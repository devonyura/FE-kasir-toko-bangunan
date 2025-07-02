import { rupiahFormat } from "@/utils/formatting";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import type { ColumnDef } from "@tanstack/react-table";

type OmzetHarian = {
  tanggal: string;
  omzet: string;
};

export const columnsOmzetHarian: ColumnDef<OmzetHarian>[] = [
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) =>
      format(new Date(row.getValue("tanggal")), "dd MMM yyyy", { locale: id }),
  },
  {
    accessorKey: "omzet",
    header: "Omzet",
    cell: ({ row }) => rupiahFormat(row.getValue("omzet")),
  },
];
