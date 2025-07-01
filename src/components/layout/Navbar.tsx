// src/components/layout/Navbar.tsx
import { Menu } from "lucide-react";

type NavbarProps = {
  toggleSidebar: () => void;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  return (
    <header className="h-14 bg-white border-b flex items-center justify-between px-6 fixed left-0 right-0 top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Tombol toggle sidebar (desktop & mobile) */}
        <button onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold">Buana Situju Dapurang Online POS</span>
      </div>
      <div className="text-sm">Selamat datang, Devon</div>
    </header>
  );
}
