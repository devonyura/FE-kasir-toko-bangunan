// src/components/layout/Navbar.tsx
import { Menu } from "lucide-react";
import { Link } from "react-router-dom"; // ⬅️ Import Link
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const isOnline = useOnlineStatus(); // 👈 pakai hook

  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 fixed left-0 right-0 top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Tombol toggle sidebar (desktop & mobile) */}
        <button onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="font-semibold hover:underline">
          BS7 Dapurang Online POS
        </Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span>Selamat datang</span>
        <div className="flex items-center gap-1">
          <div
            className={`w-5 h-5 rounded-full border-2 ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-muted-foreground">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
