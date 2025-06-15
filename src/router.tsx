// src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Transaksi from "./pages/Transaksi";
import Stok from "./pages/Stok";
import Laporan from "./pages/Laporan";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Barang from "./pages/Barang";
import ProtectedRoute from "./components/ProtectedRoute";

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
    children: [
      { index: true, element: <Home /> },
      { path: "barang", element: <Barang /> },
      { path: "transaksi", element: <Transaksi /> },
      { path: "stok", element: <Stok /> },
      { path: "laporan", element: <Laporan /> },
    ],
  },
  { path: "/register", element: <Register /> }
]);