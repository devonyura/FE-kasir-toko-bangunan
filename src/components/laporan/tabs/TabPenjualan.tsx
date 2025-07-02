import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columnsPenjualan } from "@/components/laporan/columns/columnsPenjualan";
import { rupiahFormat } from "@/utils/formatting";
import { PaginationNavigator } from "../PaginationNavigator";

type Props = {
  data: undefined[];
  summary: undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export default function TabPenjualan({
  data,
  summary,
  page,
  setPage,
  totalPages,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Laporan Penjualan</h2>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Ringkasan Penjualan</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Omset</p>
            <p className="font-bold">{rupiahFormat(summary.total_omset)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Piutang</p>
            <p className="font-bold">{rupiahFormat(summary.total_piutang)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jumlah Transaksi</p>
            <p className="font-bold">{summary.jumlah_transaksi}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rata-rata Transaksi</p>
            <p className="font-bold">
              {rupiahFormat(summary.rata_rata_transaksi)}
            </p>
          </div>
        </CardContent>
      </Card>
      <DataTable columns={columnsPenjualan} data={data} />
      <PaginationNavigator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </>
  );
}
