import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyButton";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// ==== Tambahkan tipe data ====

type GrafikPenjualanItem = {
  tanggal: string;
  total: number;
};

type TransaksiHariIni = {
  no_nota: string;
  customer: string;
  total: string;
  status: string;
};

type BarangTerlarisItem = {
  nama_barang: string;
  total_terjual: number;
};

type DashboardData = {
  penjualan_bulan_ini: string;
  total_piutang: string;
  grafik_penjualan: GrafikPenjualanItem[];
  barang_terlaris: BarangTerlarisItem[];
  penjualan_hari_ini: string;
  total_transaksi_hari_ini: string;
  transaksi_hari_ini: TransaksiHariIni[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = () => {
    axiosInstance
      .get("/laporan/dashboard")
      .then((res) => {
        console.log(res.data?.data);
        setData(res.data?.data || null);
      })
      .catch((err) => {
        console.error("Gagal ambil data dashboard:", err);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="p-4">Memuat dashboard...</div>;
  if (!data)
    return (
      <div className="p-4">
        Gagal memuat data dashboard. <Button onClick={loadPage}>Reload</Button>{" "}
      </div>
    );

  const formatRupiah = (num: string) =>
    `Rp${parseFloat(num).toLocaleString("id-ID")}`;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transaksi Penjualan Hari Ini</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="max-h-[300px] overflow-auto border rounded">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 border-b">No. Nota</th>
                  <th className="px-4 py-2 border-b">Customer</th>
                  <th className="px-4 py-2 border-b">Total</th>
                  <th className="px-4 py-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.transaksi_hari_ini?.map((trx, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      {trx.no_nota} <CopyButton teks={trx.no_nota} />{" "}
                    </td>
                    <td className="px-4 py-2 border-b">{trx.customer}</td>
                    <td className="px-4 py-2 border-b">
                      Rp{parseFloat(trx.total).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`font-semibold ${
                          trx.status === "Lunas"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.transaksi_hari_ini.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Tidak ada transaksi hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Penjualan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatRupiah(data.penjualan_hari_ini)}
            </p>
            <p className="text-lg font-semibold">
              Dari {data.total_transaksi_hari_ini} Transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Penjualan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatRupiah(data.penjualan_bulan_ini)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4"></div>

      {/* Grafik Penjualan */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Penjualan Harian Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent className="h-[40vh]">
            <Bar
              data={{
                labels: data.grafik_penjualan?.map((item) =>
                  format(new Date(item.tanggal), "EEE, dd MMMM", {
                    locale: id,
                  })
                ),
                datasets: [
                  {
                    label: "Total Penjualan",
                    data: data.grafik_penjualan?.map((item) => item.total),
                    backgroundColor: "#3b82f6",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function (value: string | number) {
                        return `Rp${Number(value).toLocaleString("id-ID")}`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Barang Terlaris */}
      <Card>
        <CardHeader>
          <CardTitle>Barang Terlaris Bulan Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {data.barang_terlaris?.map((item, index) => (
              <li
                key={index}
                className="flex justify-between border-b py-1 last:border-none"
              >
                <span>{item.nama_barang}</span>
                <span className="font-medium">{item.total_terjual}x</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
