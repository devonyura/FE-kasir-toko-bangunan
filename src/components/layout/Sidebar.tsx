// src/components/layout/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Data Barang", path: "/Barang" },
  { label: "Transaksi Beli", path: "/transaksi-beli" },
  { label: "Transaksi Jual (Hutang/Piutang Pembeli)", path: "/transaksi-jual" },
  { label: "Kasir", path: "/kasir" },
  { label: "Stok Barang", path: "/stok" },
  { label: "Laporan", path: "/laporan" },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confim = confirm("yakin ingin keluar?");
    if (confim) {
      logout();
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r fixed top-0 z-20 h-full transition-transform duration-300 md:w-64 w-64 p-4 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="font-bold text-lg border-b pb-2">Kasir Toko</div>
        <nav className="flex flex-col pt-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition ${
                location.pathname === item.path
                  ? "bg-gray-100 font-semibold"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="link" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </aside>
    </>
  );
}
