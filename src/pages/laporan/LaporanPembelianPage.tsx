// src/pages/laporan/LaporanPembelianPage.tsx

import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/utils/axios";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { columns } from "@/components/laporan-pembelian/Columns";
import { columns } from "@/components/laporan-pembelian/Columns";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import { rupiahFormat } from "@/utils/formatting";
import generateLaporanPdf, {
  type ColumnDef,
} from "@/lib/pdf/generateLaporanPdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateExcelReport } from "@/utils/generateExcelReport";

type TransaksiBeli = {
  no_nota: string;
  tanggal: string;
  nama_supplier: string;
  total: string;
  dibayar: string;
  sisa_hutang: string;
  status: string;
};

export default function LaporanPembelianPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const [startDate, setStartDate] = useState(format(firstDay, "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(today, "yyyy-MM-dd"));
  const [data, setData] = useState<TransaksiBeli[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("netral");

  const [summary, setSummary] = useState({
    total_pembelian: 0,
    sisa_hutang: 0,
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
      const res = await axiosInstance.get("/laporan/pembelian", { params });
      const result = res.data.data;
      setData(result.list || []);
      setSummary({
        total_pembelian: result.total_pembelian,
        sisa_hutang: result.sisa_hutang,
        jumlah_transaksi: result.jumlah_transaksi,
        rata_rata_transaksi: result.rata_rata_transaksi,
      });
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, page, perPage, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);

  const handleDownloadPdf = async () => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        status,
        pagination: false,
      };
      const res = await axiosInstance.get("/laporan/pembelian", { params });

      const result = res.data?.data;

      const list: TransaksiBeli[] = res.data?.data?.list || [];

      // Format total dan dibayar
      const formattedList = list.map((item) => ({
        ...item,
        total: rupiahFormat(item.total),
        sisa_hutang: rupiahFormat(item.sisa_hutang),
        dibayar: rupiahFormat(item.dibayar),
      }));

      const columns: ColumnDef[] = [
        { header: "No Nota", key: "no_nota" },
        { header: "Tanggal", key: "tanggal" },
        { header: "Supplier", key: "nama_supplier" },
        { header: "Total", key: "total" },
        { header: "Dibayar", key: "dibayar" },
        { header: "Status", key: "status" },
        { header: "Sisa Hutang", key: "sisa_hutang" },
      ];

      generateLaporanPdf({
        title: "Buana Situju Dapurang",
        subtitle: `Laporan Pembelian: ${startDate} Sampai ${endDate}`,
        columns,
        data: formattedList,
        summary: {
          total_pembelian: result.total_pembelian,
          sisa_hutang: result.sisa_hutang,
          jumlah_transaksi: result.jumlah_transaksi,
          rata_rata_transaksi: result.rata_rata_transaksi,
        },
      });
    } catch (error) {
      console.error("Gagal mengunduh PDF:", error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        status,
        pagination: false,
      };
      const res = await axiosInstance.get("/laporan/pembelian", { params });

      console.log("data", res);
      const data: TransaksiBeli[] = res.data?.data?.list || [];

      // Format total dan dibayar
      const formattedList = data.map((item) => ({
        ...item,
        total: rupiahFormat(item.total),
        sisa_hutang: rupiahFormat(item.sisa_hutang),
        dibayar: rupiahFormat(item.dibayar),
      }));

      await generateExcelReport({
        data: formattedList,
        title: "Pembelian",
        startDate,
        endDate,
        columns: [
          { header: "No Nota", key: "no_nota" },
          { header: "Tanggal", key: "tanggal" },
          { header: "Supplier", key: "nama_supplier" },
          { header: "Total", key: "total" },
          { header: "Dibayar", key: "dibayar" },
          { header: "Status", key: "status" },
          { header: "Sisa Hutang", key: "sisa_hutang" },
        ],
        multipleSheetColumn: "nama_supplier",
      });
    } catch (error) {
      console.error("Gagal download excel:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Laporan Pembelian</h1>
        <p className="text-muted-foreground text-sm">
          Menampilkan rekap laporan transaksi pembelian dari supplier.
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
              <SelectItem value="Hutang">Hutang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-1 flex gap-2">
          <Button variant="destructive" onClick={handleDownloadPdf}>
            PDF
            <DownloadIcon className="w-4 h-4" />
            <FileTextIcon className="w-4 h-4 ml-1" />
          </Button>
          <Button onClick={handleDownloadExcel}>
            Excel
            <DownloadIcon className="w-4 h-4" />
            <FileSpreadsheetIcon className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {!loading && (
        <DataTable columns={columns} data={data} filterKey="no_nota" />
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

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            Ringkasan Pembelian:{" "}
            {format(parseISO(startDate), "d MMM yyyy", { locale: id })} -{" "}
            {format(parseISO(endDate), "d MMM yyyy", { locale: id })}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Pembelian</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_pembelian)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Sisa Hutang</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.sisa_hutang)}
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
    </div>
  );
}
