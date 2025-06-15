// src/components/layout/Layout.tsx
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pt-14 md:ml-64">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}