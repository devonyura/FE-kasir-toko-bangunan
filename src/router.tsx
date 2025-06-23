// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
// import Transaksi from "./pages/Transaksi";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Barang from "./pages/Barang";
import ProtectedRoute from "./components/ProtectedRoute";
import TransaksiBeliPage from "./pages/transaksi/TransaksiBeliPage";
import StokPage from "./pages/stok/StokPage";
import KasirPage from "./pages/kasir/KasirPage";
import TransaksiJualPage from "./pages/transaksi/TransaksiJualPage";
import UserPage from "./pages/UserPage";

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
      { index: true, element: <Home /> },
      { path: "barang", element: <Barang /> },
      { path: "transaksi-beli", element: <TransaksiBeliPage /> },
      { path: "transaksi-jual", element: <TransaksiJualPage /> },
      { path: "kasir", element: <KasirPage /> },
      { path: "stok", element: <StokPage /> },
      { path: "laporan", element: <Laporan /> },
      { path: "users", element: <UserPage /> },
    ],
  },
  { path: "/register", element: <Register /> },
]);
