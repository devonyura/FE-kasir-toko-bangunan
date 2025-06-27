// src/pages/laporan/LaporanPenjualanPage.tsx
import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/utils/axios";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/laporan-penjualan/Columns";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import generateLaporanPdf, {
  type ColumnDef,
} from "@/lib/pdf/generateLaporanPdf";
import { rupiahFormat } from "@/utils/formatting";

type TransaksiJual = {
  no_nota: string;
  tanggal: string;
  customer: string;
  total: string;
  dibayar: string;
  status: string;
};

export default function LaporanPenjualanPage() {
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [status, setStatus] = useState("netral");

  const [data, setData] = useState<TransaksiJual[]>([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    total_omset: 0,
    total_piutang: 0,
    jumlah_transaksi: 0,
    rata_rata_transaksi: 0,
  });

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        start_date: startDate,
        end_date: endDate,
        page,
        perPage,
        status,
      };
      const res = await axiosInstance.get("/laporan/penjualan", { params });
      const result = res.data?.data;
      setData(result.list || []);
      setSummary({
        total_omset: result.total_omset,
        total_piutang: result.total_piutang,
        jumlah_transaksi: result.jumlah_transaksi,
        rata_rata_transaksi: result.rata_rata_transaksi,
      });
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
    } finally {
      setLoading(false);
    }
  }, [endDate, startDate, page, perPage, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  // Reset page ke 1 jika filter (startDate, endDate, status) berubah
  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, status]);

  const handleDownloadPdf = async () => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        status,
        pagination: false,
      };
      const res = await axiosInstance.get("/laporan/penjualan", { params });

      const result = res.data?.data;

      const list: TransaksiJual[] = res.data?.data?.list || [];

      // Format total dan dibayar
      const formattedList = list.map((item) => ({
        ...item,
        total: rupiahFormat(item.total),
        dibayar: rupiahFormat(item.dibayar),
      }));

      const columns: ColumnDef[] = [
        { header: "No Nota", key: "no_nota" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Customer", key: "customer" },
        { header: "Total", key: "total" },
        { header: "Dibayar", key: "dibayar" },
        { header: "Status", key: "status" },
      ];

      generateLaporanPdf({
        title: "Buana Situju Dapurang",
        subtitle: `Laporan penjualan: ${startDate} Sampai ${endDate}`,
        columns,
        data: formattedList,
        summary: {
          total_omset: result.total_omset,
          total_piutang: result.total_piutang,
          jumlah_transaksi: result.jumlah_transaksi,
          rata_rata_transaksi: result.rata_rata_transaksi,
        },
      });
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
    }
  };

  // ===================== FORMAT TANGGAL RANGE
  const formatTanggalRange = (start: string, end: string) => {
    const tanggalAwal = format(parseISO(start), "d MMMM", { locale: id });
    const tanggalAkhir = format(parseISO(end), "d MMMM yyyy", { locale: id });
    return `${tanggalAwal} - ${tanggalAkhir}`;
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
        <p className="text-muted-foreground text-sm">
          Menampilkan rekap laporan transaksi penjualan.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netral">Semua</SelectItem>
              <SelectItem value="Lunas">Lunas</SelectItem>
              <SelectItem value="Piutang">Piutang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-1">
          <Button onClick={handleDownloadPdf}>Download PDF</Button>
        </div>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Ringkasan Penjualan: {formatTanggalRange(startDate, endDate)}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Omset</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_omset)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Piutang</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_piutang)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Jumlah Transaksi</p>
            <p className="text-lg font-bold">{summary.jumlah_transaksi}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Rata-rata Transaksi</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.rata_rata_transaksi)}
            </p>
          </div>
        </CardContent>
      </Card>
      {!loading && (
        <DataTable columns={columns} data={data} filterKey="customer" />
      )}

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Sebelumnya
          </Button>
          <span className="text-sm">
            Halaman {page} dari {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}
