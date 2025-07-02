import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columnsOmzetHarian } from "@/components/laporan/columns/columnsOmzetHarian";
interface Props {
  data: any[]; // atau ubah ke tipe spesifik jika ada
}

export default function TabOmzetHarian({ data }: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Omzet Harian</h2>
      <DataTable columns={columnsOmzetHarian} data={data} />
    </>
  );
}
