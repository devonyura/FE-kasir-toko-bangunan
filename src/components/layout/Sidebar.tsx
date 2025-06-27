// src/components/layout/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth";

type MenuItem = {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
};

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "Data Barang", path: "/Barang" },
  { label: "Retur Barang", path: "/retur" },
  { label: "Transaksi Beli", path: "/transaksi-beli" },
  { label: "Transaksi Jual (Hutang/Piutang Pembeli)", path: "/transaksi-jual" },
  { label: "Kasir", path: "/kasir" },
  { label: "Stok Barang", path: "/stok" },
  {
    label: "Laporan",
    children: [
      { label: "Laporan Penjualan", path: "/laporan-penjualan" },
      { label: "Laporan Pembelian", path: "/laporan-pembelian" },
      { label: "Laporan Stok", path: "/laporan-stok" },
    ],
  },
  { label: "Akun Manager", path: "/users" },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = confirm("Yakin ingin keluar?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <>
      {/* Tombol toggle sidebar khusus mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r fixed top-0 left-0 z-20 h-full w-64 p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="font-bold text-lg border-b pb-2">Kasir Toko</div>

        <nav className="flex flex-col pt-4 space-y-1">
          {menuItems.map((item, index) => {
            if (item.children) {
              const isOpenMenu = openMenus.includes(item.label);
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded transition"
                  >
                    {item.label}
                    {isOpenMenu ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {isOpenMenu && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={
                            child.label === "Kasir" ? toggleSidebar : undefined
                          }
                          className={`block px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition ${
                            location.pathname === child.path
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path!}
                onClick={item.label === "Kasir" ? toggleSidebar : undefined}
                className={`px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition ${
                  location.pathname === item.path
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <Button variant="link" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </aside>
    </>
  );
}
