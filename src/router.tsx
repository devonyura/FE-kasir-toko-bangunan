// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
// import Transaksi from "./pages/Transaksi";
import Login from "./pages/Login";
import Barang from "./pages/Barang";
import ProtectedRoute from "./components/ProtectedRoute";
import TransaksiBeliPage from "./pages/transaksi/TransaksiBeliPage";
import StokPage from "./pages/stok/StokPage";
import KasirPage from "./pages/kasir/KasirPage";
import TransaksiJualPage from "./pages/transaksi/TransaksiJualPage";
import UserPage from "./pages/UserPage";
import ReturPage from "./pages/retur/ReturPage";
import DashboardPage from "./pages/DashboardPage";
import LaporanPenjualanPage from "./pages/laporan/LaporanPenjualanPage";
import LaporanPembelianPage from "./pages/laporan/LaporanPembelianPage";
import LaporanBulananPage from "./pages/laporan/LaporanBulananPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <div>Terjadi kesalahan aplikasi</div>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "barang", element: <Barang /> },
      { path: "retur", element: <ReturPage /> },
      { path: "transaksi-beli", element: <TransaksiBeliPage /> },
      { path: "transaksi-jual", element: <TransaksiJualPage /> },
      { path: "kasir", element: <KasirPage /> },
      { path: "stok", element: <StokPage /> },
      { path: "laporan-bulanan", element: <LaporanBulananPage /> },
      { path: "laporan-penjualan", element: <LaporanPenjualanPage /> },
      { path: "laporan-pembelian", element: <LaporanPembelianPage /> },
      { path: "users", element: <UserPage /> },
    ],
  },
]);
