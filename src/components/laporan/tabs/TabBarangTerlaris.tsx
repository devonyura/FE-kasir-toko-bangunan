// ✅ Import atau definisikan tipe PerformaBarang
import { columnsPerformaBarang } from "@/components/laporan/columns/columnsPerformaBarang";

import type { PerformaBarang } from "@/components/laporan/columns/columnsPerformaBarang";
import { DataTable } from "@/components/transaksi-beli/DataTable";

interface Props {
  data: PerformaBarang[]; // ✅ FIX: ubah dari undefined[] ke PerformaBarang[]
}

export default function TabBarangTerlaris({ data }: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Laporan Penjualan Barang</h2>
      <DataTable columns={columnsPerformaBarang} data={data} />
    </>
  );
}
