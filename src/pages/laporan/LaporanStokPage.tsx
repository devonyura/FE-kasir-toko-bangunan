// src/pages/laporan/LaporanStokPage.tsx

import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import { columns } from "@/components/laporan-stok/Columns";
import { rupiahFormat } from "@/utils/formatting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateExcelReport } from "@/utils/generateExcelReport";
import { FileSpreadsheetIcon } from "lucide-react";
import { Button } from "@/components/ui/button";




type LaporanStok = {
  nama_lengkap: string;
  jumlah: number;
  nama_kategori: string;
  harga_beli: number;
  harga_jual: number;
  total_aset: number;
};

export default function LaporanStokPage() {
  const [data, setData] = useState<LaporanStok[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total_asset_beli: 0,
    total_asset_jual: 0,
    total_laba: 0,
  });


  const handleDownloadExcel = async () => {
    try {
      const res = await axiosInstance.get("/laporan/barang");
      const data = res.data?.data || [];

      await generateExcelReport({
        data,
        title: "Data Barang",
        columns: [
          { header: "Nama Barang", key: "nama_lengkap", width: 40 },
          { header: "Kode Barcode", key: "kode_barang_tipe" },
          { header: "Kategori", key: "nama_kategori" },
          { header: "Harga Beli", key: "harga_beli" },
          { header: "Harga Jual", key: "harga_jual" },
          { header: "Selisih", key: "selisih" },
          { header: "Stok", key: "stok" },
        ],
        multipleSheetColumn: "nama_kategori",
      });
    } catch (error) {
      console.error("Gagal generate Excel:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/laporan/stok");
        const result = res.data?.data || [];
        setData(result);
        setSummary(res.data?.summary || {});
      } catch (err) {
        console.error("Gagal memuat laporan stok:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Laporan Stok</h1>
        <p className="text-muted-foreground text-sm">
          Menampilkan rekap stok barang dan nilai aset.
        </p>
        <Button
          variant="outline"
          className="w-full sm:w-fit"
          onClick={handleDownloadExcel}
        >
          <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
          Export Excel
        </Button>
      </div>

      {!loading && (
        <DataTable columns={columns} data={data} filterKey="nama_lengkap" />
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ringkasan Stok & Aset</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Total Asset Keseluruhan</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_asset_beli)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Asset dengan selisih</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_asset_jual)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Laba/Selisih Potensial</p>
            <p className="text-lg font-bold">
              {rupiahFormat(summary.total_laba)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
