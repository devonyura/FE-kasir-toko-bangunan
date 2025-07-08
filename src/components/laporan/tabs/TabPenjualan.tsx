import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columnsPenjualan } from "@/components/laporan/columns/columnsPenjualan";
import { rupiahFormat } from "@/utils/formatting";
import { PaginationNavigator } from "../PaginationNavigator";
import type { TransaksiJual } from "@/components/transaksi-jual/types";

interface Props {
  data: TransaksiJual[]; // ✅ Ganti dari undefined[]
  summary: {
    total_omset: number;
    total_piutang: number;
    jumlah_transaksi: number;
    rata_rata_transaksi: number;
  };
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

interface Props {
  data: TransaksiJual[]; // bisa diganti dengan tipe khusus jika ada
  summary: {
    total_omset: number;
    total_piutang: number;
    jumlah_transaksi: number;
    rata_rata_transaksi: number;
  };
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export default function TabPenjualan({
  data,
  summary,
  page,
  setPage,
  totalPages,
}: Props) {
  return (
    <div>
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
      <DataTable<TransaksiJual, unknown>
        columns={columnsPenjualan}
        data={data}
      />
      <PaginationNavigator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
    </div>
  );
}
