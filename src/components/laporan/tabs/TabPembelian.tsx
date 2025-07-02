import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columnsPembelian } from "@/components/laporan/columns/columnsPembelian";
import { rupiahFormat } from "@/utils/formatting";
import { PaginationNavigator } from "../PaginationNavigator";

type Props = {
  data: TransaksiPembelian[];
  summary: PembelianSummary | null | never;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};
type PembelianSummary = {
  total_pembelian: number;
  sisa_hutang: number;
  jumlah_transaksi: number;
  rata_rata_transaksi: number;
};

type TransaksiPembelian = {
  no_nota: string;
  tanggal: string;
  nama_supplier: string;
  total: number;
  sisa_hutang: number;
  status: string;
  dibayar: number;
};
export default function TabPembelian({
  data,
  summary,
  page,
  setPage,
  totalPages,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Laporan Pembelian</h2>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ringkasan Pembelian</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Pembelian</p>
            <p className="font-bold">
              {rupiahFormat(summary?.total_pembelian || "")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Sisa Hutang</p>
            <p className="font-bold">
              {rupiahFormat(summary?.sisa_hutang || "")}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
            <p className="font-bold">{summary?.jumlah_transaksi || ""}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
            <p className="font-bold">
              {rupiahFormat(summary?.rata_rata_transaksi || 0)}
            </p>
          </div>
        </CardContent>
      </Card>
      <DataTable
        columns={columnsPembelian}
        data={data.map((d) => ({
          ...d,
          total: d.total.toString(),
          dibayar: d.dibayar.toString(),
          sisa_hutang: d.sisa_hutang.toString(),
        }))}
      />
      <PaginationNavigator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </>
  );
}
