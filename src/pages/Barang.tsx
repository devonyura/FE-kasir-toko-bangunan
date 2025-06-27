// src/pages/Barang.tsx
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { axiosInstance } from "@/utils/axios";
import BarangDialogForm from "@/components/barang/BarangDialogForm";
import DeleteConfirmDialog from "@/components/barang/DeleteConfirmDialog";
import KelolaSatuanDialog from "@/components/barang/KelolaSatuanDialog";

import { DataTable } from "@/components/barang/DataTable";
import { columns } from "@/components/barang/columns";
import type { Barang } from "@/components/barang/types";

export default function BarangPage() {
  // ----------------------------
  // State utama
  // ----------------------------
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ----------------------------
  // Dialog tambah/edit/delete
  // ----------------------------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Barang | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // ----------------------------
  // Dialog kelola satuan
  // ----------------------------
  const [barangIdUntukSatuan, setBarangIdUntukSatuan] = useState<string | null>(
    null
  );
  const [kelolaSatuanOpen, setKelolaSatuanOpen] = useState(false);

  // ==============================
  // Fetch barang dari backend
  // ==============================
  const fetchBarang = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/barang");
      console.log(res.data.data);
      setBarangs(res.data.data);
    } catch {
      setError("Gagal memuat data barang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // ==============================
  // Handler sukses tambah/edit
  // ==============================
  const handleSuccess = (message: string, newId?: string) => {
    setDialogOpen(false);
    setSuccessMessage(message);
    fetchBarang();

    if (newId) {
      setBarangIdUntukSatuan(newId);
      setKelolaSatuanOpen(true);
    }

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ==============================
  // Handler hapus barang
  // ==============================
  const handleDeleteConfirm = async () => {
    if (!selectedDeleteId) return;
    try {
      const res = await axiosInstance.delete(`/barang/${selectedDeleteId}`);
      if (res.data?.status === "success") {
        setSuccessMessage(res.data.message || "Barang dihapus");
        fetchBarang();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err: unknown) {
      const msg = err?.response?.data?.message || "Gagal menghapus barang.";
      setError(msg);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  // ==============================
  // Render
  // ==============================
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Kelola Barang</h1>
      <p className="text-sm text-muted-foreground">
        Mengelola data barang, kategori barang hingga menentukan satuan per
        barang
      </p>
      <div className="flex justify-between items-start mb-4 w-full">
        <div className="flex flex-col gap-1 max-w-sm">
          <Button
            onClick={() => {
              setEditData(null);
              setDialogOpen(true);
            }}
          >
            Tambah Barang
          </Button>
        </div>
      </div>
      {/* Notifikasi sukses */}
      {successMessage && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <AlertCircleIcon className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700">Berhasil</AlertTitle>
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Notifikasi error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-5 w-5" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Tabel barang */}
      {loading ? (
        <Button size="lg" disabled className="w-full">
          <Loader2Icon className="animate-spin mr-2" />
          Mohon tunggu...
        </Button>
      ) : (
        <DataTable
          data={barangs}
          columns={columns(
            (barang) => {
              setEditData(barang);
              setDialogOpen(true);
            },
            (id) => {
              setSelectedDeleteId(id);
              setDeleteDialogOpen(true);
            },
            (id) => {
              setBarangIdUntukSatuan(id);
              setKelolaSatuanOpen(true);
            }
          )}
          filterKey="nama_barang"
          totalCountText={`Total barang: ${barangs.length}`}
        />
      )}

      {/* Dialog Tambah/Edit */}
      <BarangDialogForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editData}
        onSuccess={handleSuccess}
      />

      {/* Dialog Kelola Satuan */}
      {barangIdUntukSatuan && (
        <KelolaSatuanDialog
          open={kelolaSatuanOpen}
          onOpenChange={(open) => {
            setKelolaSatuanOpen(open);
            if (!open) setBarangIdUntukSatuan(null);
          }}
          barangId={barangIdUntukSatuan}
        />
      )}

      {/* Dialog Konfirmasi Hapus */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
