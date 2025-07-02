import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axios";
import { parse, endOfMonth, format } from "date-fns";

import TabPenjualan from "@/components/laporan/tabs/TabPenjualan";
import TabPembelian from "@/components/laporan/tabs/TabPembelian";
import TabBarangTerlaris from "@/components/laporan/tabs/TabBarangTerlaris";
import TabLabaRugi from "@/components/laporan/tabs/TabLabaRugi";
import TabOmzetHarian from "@/components/laporan/tabs/TabOmzetHarian";

// 🔁 Helper untuk konversi bulan (yyyy-MM) jadi tanggal lengkap
const getStartEndDate = (month: string) => {
  const start = parse(month, "yyyy-MM", new Date());
  const end = endOfMonth(start);
  return {
    start_date: format(start, "yyyy-MM-dd"),
    end_date: format(end, "yyyy-MM-dd"),
  };
};

export default function LaporanBulananPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  );
  const { start_date, end_date } = getStartEndDate(selectedMonth);

  // TODO: State masing-masing tab bisa kamu deklarasikan dan fetch sesuai tab
  // ==================== STATE & FETCHING DATA ====================
  const [dataPenjualan, setDataPenjualan] = useState([]);
  const [summaryPenjualan, setSummaryPenjualan] = useState({
    total_omset: 0,
    total_piutang: 0,
    jumlah_transaksi: 0,
    rata_rata_transaksi: 0,
  });

  const [dataPembelian, setDataPembelian] = useState([]);
  const [summaryPembelian, setSummaryPembelian] = useState({
    total_pembelian: 0,
    sisa_hutang: 0,
    jumlah_transaksi: 0,
    rata_rata_transaksi: 0,
  });

  const [dataPerformaBarang, setDataPerformaBarang] = useState([]);
  const [dataOmzetHarian, setDataOmzetHarian] = useState([]);
  const [summaryLabaRugi, setSummaryLabaRugi] = useState({
    omset_penjualan: 0,
    retur_penjualan: 0,
    penjualan_bersih: 0,
    modal_pembelian: 0,
    retur_pembelian: 0,
    pembelian_bersih: 0,
    laba_kotor: 0,
  });

  // Penjualan
  const [penjualanPage, setPenjualanPage] = useState(1);
  const [penjualanTotalPages, setPenjualanTotalPages] = useState(1);

  // Pembelian
  const [pembelianPage, setPembelianPage] = useState(1);
  const [pembelianTotalPages, setPembelianTotalPages] = useState(1);

  // PerPage global (bisa beda per tab jika perlu)
  const [perPage] = useState(10);

  // Fetch semua data ketika bulan berubah
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [penjualanRes, pembelianRes, performaRes, labaRes, omzetRes] =
          await Promise.all([
            axiosInstance.get("/laporan/penjualan", {
              params: {
                start_date,
                end_date,
                status: "netral",
                page: penjualanPage,
                perPage,
              },
            }),
            axiosInstance.get("/laporan/pembelian", {
              params: {
                start_date,
                end_date,
                status: "netral",
                page: pembelianPage,
                perPage,
              },
            }),
            axiosInstance.get("/laporan/performa-barang", {
              params: { start_date, end_date },
            }),
            axiosInstance.get("/laporan/laba-rugi", {
              params: { start_date, end_date },
            }),
            axiosInstance.get("/laporan/omzet-harian", {
              params: { start_date, end_date },
            }),
          ]);

        // === Penjualan
        setDataPenjualan(penjualanRes.data.data.list || []);
        setSummaryPenjualan({
          total_omset: penjualanRes.data.data.total_omset,
          total_piutang: penjualanRes.data.data.total_piutang,
          jumlah_transaksi: penjualanRes.data.data.jumlah_transaksi,
          rata_rata_transaksi: penjualanRes.data.data.rata_rata_transaksi,
        });
        setPenjualanTotalPages(penjualanRes.data.pagination?.totalPages || 1);

        // === Pembelian
        setDataPembelian(pembelianRes.data.data.list || []);
        setSummaryPembelian({
          total_pembelian: pembelianRes.data.data.total_pembelian,
          sisa_hutang: pembelianRes.data.data.sisa_hutang,
          jumlah_transaksi: pembelianRes.data.data.jumlah_transaksi,
          rata_rata_transaksi: pembelianRes.data.data.rata_rata_transaksi,
        });
        setPembelianTotalPages(pembelianRes.data.pagination?.totalPages || 1);

        // === Performa Barang
        setDataPerformaBarang(performaRes.data.data || []);

        // === Laba Rugi
        setSummaryLabaRugi(labaRes.data.data || {});

        // === Omzet Harian
        setDataOmzetHarian(omzetRes.data.data || []);
      } catch (err) {
        console.error("Gagal fetch data laporan:", err);
      }
    };

    fetchData();
  }, [start_date, end_date, penjualanPage, pembelianPage, perPage]);

  useEffect(() => {
    setPenjualanPage(1);
    setPembelianPage(1);
    // dst jika ada
  }, [start_date, end_date]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Laporan Bulanan</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Rekap laporan berdasarkan bulan. Pilih bulan di bawah:
      </p>

      <div className="mb-6 max-w-xs">
        <label className="block mb-1 text-sm font-medium">Pilih Bulan</label>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          max={format(new Date(), "yyyy-MM")}
        />
      </div>

      <Tabs defaultValue="penjualan" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="penjualan">Penjualan</TabsTrigger>
          <TabsTrigger value="pembelian">Pembelian</TabsTrigger>
          <TabsTrigger value="barang-terlaris">Penjualan Barang</TabsTrigger>
          <TabsTrigger value="laba-rugi">Laba Rugi</TabsTrigger>
          <TabsTrigger value="omzet-harian">Omzet Harian</TabsTrigger>
        </TabsList>

        <TabsContent value="penjualan">
          <TabPenjualan
            data={dataPenjualan}
            summary={summaryPenjualan}
            page={penjualanPage}
            setPage={setPenjualanPage}
            totalPages={penjualanTotalPages}
          />
        </TabsContent>

        <TabsContent value="pembelian">
          <TabPembelian
            data={dataPembelian}
            summary={summaryPembelian || null}
            page={pembelianPage}
            setPage={setPembelianPage}
            totalPages={pembelianTotalPages}
          />
        </TabsContent>

        <TabsContent value="barang-terlaris">
          <TabBarangTerlaris data={dataPerformaBarang || null} />
        </TabsContent>

        <TabsContent value="laba-rugi">
          <TabLabaRugi summary={summaryLabaRugi || null} />
        </TabsContent>

        <TabsContent value="omzet-harian">
          <TabOmzetHarian data={dataOmzetHarian || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
