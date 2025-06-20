// src/pages/stok/StokPage.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/utils/axios";
import { PlusIcon } from "lucide-react";
import { columns } from "./Columns";
import { DataTable } from "./DataTable";
import StokDialogForm from "@/components/stok/StokDialogForm";
import StokKeluarDialogForm from "@/components/stok/StokKeluarDialogForm";
import DetailStokDialog from "@/components/stok/DetailStokDialog";
import StokWarningSection from "@/components/stok/StokWarningSection";

export default function StokPage() {
  const [stokData, setStokData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stokDialogOpen, setStokDialogOpen] = useState(false);
  const [stokKeluarOpen, setStokKeluarOpen] = useState(false);

  // state untuk DetailStokDialog
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedBarangId, setSelectedBarangId] = useState<string | null>(null);
  const [selectedBarangNama, setSelectedBarangNama] = useState<string>("");

  const fetchStok = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/stok");
      // console.log("stokData:", res.data.data);
      setStokData(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStok();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Manajemen Stok</h1>
          <p className="text-sm text-muted-foreground">
            Daftar stok terkini per barang dan satuan
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setStokDialogOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-1" /> Stok Masuk
          </Button>
          <Button variant="outline" onClick={() => setStokKeluarOpen(true)}>
            <PlusIcon className="w-4 h-4 mr-1" /> Stok Keluar
          </Button>
        </div>
      </div>
      <div className="">
        <StokWarningSection />
      </div>
      <DataTable
        columns={columns((id, nama) => {
          setSelectedBarangId(id);
          setSelectedBarangNama(nama);
          setTimeout(() => setDetailOpen(true), 100);
          setDetailOpen(true);
        })}
        data={stokData}
        loading={loading}
      />
      <StokDialogForm
        open={stokDialogOpen}
        onOpenChange={setStokDialogOpen}
        onSuccess={fetchStok}
      />
      <StokKeluarDialogForm
        open={stokKeluarOpen}
        onOpenChange={setStokKeluarOpen}
        onSuccess={fetchStok}
      />

      <DetailStokDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        barangId={selectedBarangId}
        barangNama={selectedBarangNama}
      />
    </div>
  );
}
