// src/pages/DashboardPage.tsx

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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const [data, setData] = useState<undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/laporan/dashboard")
      .then((res) => {
        console.log(res.data?.data);
        setData(res.data?.data || {});
      })
      .catch((err) => {
        console.error("Gagal ambil data dashboard:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Memuat dashboard...</div>;
  if (!data) return <div className="p-4">Gagal memuat data dashboard.</div>;

  const formatRupiah = (num: number) =>
    `Rp${parseFloat(num).toLocaleString("id-ID")}`;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <Card>
          <CardHeader>
            <CardTitle>Pembelian Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatRupiah(data.pembelian_bulan_ini)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hutang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatRupiah(data.total_hutang)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Piutang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {formatRupiah(data.total_piutang)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik Penjualan dan Pembelian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Penjualan</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: data.grafik_penjualan?.map(
                  (item: undefined) => item.tanggal
                ),
                datasets: [
                  {
                    label: "Total Penjualan",
                    data: data.grafik_penjualan?.map(
                      (item: undefined) => item.total
                    ),
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
                      callback: (value) =>
                        `Rp${parseInt(value as string).toLocaleString(
                          "id-ID"
                        )}`,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grafik Pembelian</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: data.grafik_pembelian?.map(
                  (item: undefined) => item.tanggal
                ),
                datasets: [
                  {
                    label: "Total Pembelian",
                    data: data.grafik_pembelian?.map(
                      (item: undefined) => item.total
                    ),
                    backgroundColor: "#10b981",
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
                      callback: (value) =>
                        `Rp${parseInt(value as string).toLocaleString(
                          "id-ID"
                        )}`,
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
            {data.barang_terlaris?.map((item: undefined, index: number) => (
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
