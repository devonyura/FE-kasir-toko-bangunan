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
  { label: "Kasir", path: "/kasir" },
  {
    label: "Laporan",
    children: [
      { label: "Laporan Bulanan", path: "/laporan-bulanan" },
      { label: "Laporan Penjualan", path: "/laporan-penjualan" },
      { label: "Laporan Pembelian", path: "/laporan-pembelian" },
    ],
  },
  { label: "Data Barang", path: "/Barang" },
  { label: "Stok Barang", path: "/stok" },
  { label: "Transaksi Beli", path: "/transaksi-beli" },
  { label: "Transaksi Jual (Hutang/Piutang Pembeli)", path: "/transaksi-jual" },
  { label: "Retur Barang", path: "/retur" },
  { label: "Akun Manager", path: "/users" },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const isMobile = () => window.innerWidth < 768;

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

  // Ambil role dari localStorage
  const role =
    JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user
      ?.role || "";

  console.log("role", role);

  // Filter menu berdasarkan role
  const filteredMenu = menuItems.filter((item) => {
    if (role === "admin") return true;
    if (role === "owner" && item.label === "Akun Manager") return false;
    if (role === "kasir") {
      return [
        "Kasir",
        "Data Barang",
        "Stok Barang",
        "Retur Barang",
        "Transaksi Beli",
        "Transaksi Jual (Hutang/Piutang Pembeli)",
      ].includes(item.label);
    }
    return true;
  });

  return (
    <>
      {/* Tombol toggle sidebar mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside
        className={`bg-white border-r fixed top-0 left-0 z-20 h-full w-64 p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="font-bold text-lg border-b pb-2">Kasir Toko</div>

        <nav className="flex flex-col pt-4 space-y-1">
          {filteredMenu.map((item, index) => {
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
                          onClick={() => {
                            if (isMobile()) toggleSidebar();
                          }}
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
                onClick={() => {
                  if (isMobile()) toggleSidebar();
                }}
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
