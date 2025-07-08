// src/components/layout/Sidebar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Layers,
  ReceiptText,
  Users,
  Undo,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/auth";

type MenuItem = {
  label: string;
  path?: string;
  icon?: JSX.Element;
  children?: { label: string; path: string; icon?: JSX.Element }[];
};

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="w-4 h-4 mr-2" />,
  },
  {
    label: "Kasir",
    path: "/kasir",
    icon: <ShoppingCart className="w-4 h-4 mr-2" />,
  },
  {
    label: "Laporan",
    icon: <FileText className="w-4 h-4 mr-2" />,
    children: [
      { label: "Laporan Bulanan", path: "/laporan-bulanan" },
      { label: "Laporan Penjualan", path: "/laporan-penjualan" },
      { label: "Laporan Pembelian", path: "/laporan-pembelian" },
    ],
  },
  {
    label: "Data Barang",
    path: "/Barang",
    icon: <Package className="w-4 h-4 mr-2" />,
  },
  {
    label: "Stok Barang",
    path: "/stok",
    icon: <Layers className="w-4 h-4 mr-2" />,
  },
  {
    label: "Transaksi Beli",
    path: "/transaksi-beli",
    icon: <ReceiptText className="w-4 h-4 mr-2" />,
  },
  {
    label: "Transaksi Jual (Hutang/Piutang Pembeli)",
    path: "/transaksi-jual",
    icon: <ReceiptText className="w-4 h-4 mr-2" />,
  },
  {
    label: "Retur Barang",
    path: "/retur",
    icon: <Undo className="w-4 h-4 mr-2" />,
  },
  {
    label: "Akun Manager",
    path: "/users",
    icon: <Users className="w-4 h-4 mr-2" />,
  },
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

  const role =
    JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.user
      ?.role || "";

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

        <nav className="flex flex-col pt-4 space-y-1 overflow-y-auto max-h-[calc(100vh-60px)] pr-2">
          {filteredMenu.map((item, index) => {
            if (item.children) {
              const isOpenMenu = openMenus.includes(item.label);
              return (
                <div key={index}>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="flex justify-between items-center w-full px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded transition"
                  >
                    <span className="flex items-center">
                      {item.icon}
                      {item.label}
                    </span>
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
                          className={`flex items-center px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition ${
                            location.pathname === child.path
                              ? "bg-gray-100 font-semibold"
                              : ""
                          }`}
                        >
                          <span className="ml-2">{child.label}</span>
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
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition ${
                  location.pathname === item.path
                    ? "bg-gray-100 font-semibold"
                    : ""
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}

          <Button
            variant="link"
            onClick={handleLogout}
            className="flex items-center px-4 mt-4 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </nav>
      </aside>
    </>
  );
}
