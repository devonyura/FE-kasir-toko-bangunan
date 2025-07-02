import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columnsPerformaBarang } from "@/components/laporan/columns/columnsPerformaBarang";

export default function TabBarangTerlaris({ data }: undefined) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Laporan Penjualan Barang</h2>
      <DataTable columns={columnsPerformaBarang} data={data} />
    </>
  );
}
