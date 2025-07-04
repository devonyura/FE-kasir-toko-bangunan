// src/pages/Barang.tsx
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheetIcon } from "lucide-react";

import { axiosInstance } from "@/utils/axios";
import BarangDialogForm from "@/components/barang/BarangDialogForm";
import DeleteConfirmDialog from "@/components/barang/DeleteConfirmDialog";
import KelolatipeDialog from "@/components/barang/KelolaTipeDialog";

import { DataTable } from "@/components/barang/DataTable";
import { Columns } from "@/components/barang/Columns";
import type { Barang } from "@/components/barang/types";
import axios from "axios";
import { generateExcelReport } from "@/utils/generateExcelReport";

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

  // const [openPreview, setOpenPreview] = useState(false);
  // const [barcodeData, setBarcodeData] = useState<Barang | null>(null);
  // const [selectedBarang, setSelectedBarang] = useState<{
  //   nama_barang: string;
  //   kode_barang: string;
  // } | null>(null);

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
      setTimeout(() => setError(""), 3000);
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
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.message || "Gagal menghapus barang.";
        setError(msg);
        setTimeout(() => setError(""), 3000);
      }
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const res = await axiosInstance.get("/laporan/barang");
      const data = res.data?.data || [];

      await generateExcelReport({
        data,
        title: "Data Barang",
        columns: [
          { header: "Nama Barang", key: "nama_lengkap", width: 40 },
          { header: "Kode Barcode", key: "kode_barang_tipe" },
          { header: "Kategori", key: "nama_kategori" },
          { header: "Harga Beli", key: "harga_beli" },
          { header: "Harga Jual", key: "harga_jual" },
          { header: "Stok", key: "stok" },
        ],
        multipleSheetColumn: "nama_kategori",
      });
    } catch (error) {
      console.error("Gagal generate Excel:", error);
    }
  };

  // ==============================
  // Render
  // ==============================
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl md:text-2xl font-bold tracking-tight">
        Kelola Barang
      </h1>
      <p className="text-sm md:text-base text-muted-foreground">
        Mengelola data barang, kategori barang hingga menentukan satuan per
        barang
      </p>

      {/* Tombol Tambah */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
        <div className="flex flex-col gap-1 w-full sm:max-w-sm">
          <Button
            className="w-full sm:w-fit"
            onClick={() => {
              setEditData(null);
              setDialogOpen(true);
            }}
          >
            Tambah Barang
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-fit"
            onClick={handleDownloadExcel}
          >
            <FileSpreadsheetIcon className="w-4 h-4 mr-2" />
            Export Excel
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
        <div className="overflow-x-auto">
          <DataTable
            data={barangs}
            columns={Columns(
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
        </div>
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
        <KelolatipeDialog
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

      {/* Dialog Preview Barcode */}
      {/* {barcodeData && (
        <LabelBarcodePreviewDialog1
          open={openPreview}
          onOpenChange={setOpenPreview}
          barang={barcodeData}
        />
      )} */}
    </div>
  );
}
