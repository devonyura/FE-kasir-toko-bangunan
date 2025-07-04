// src/components/layout/Navbar.tsx
import { Menu, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom"; // ⬅️ Import Link

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const handleHardRefresh = () => {
    window.location.href = "/"; // ⬅️ Vanilla redirect full reload
  };
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 fixed left-0 right-0 top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Tombol toggle sidebar (desktop & mobile) */}
        <button onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="font-semibold hover:underline">
          Buana Situju Dapurang Online POS
        </Link>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span>Selamat datang, Devon</span>
        <button
          onClick={handleHardRefresh}
          title="Refresh"
          className="hover:bg-muted p-1 rounded"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
