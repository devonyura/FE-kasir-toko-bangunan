// Form tambah/edit barang (modal dialog)

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

// Tipe props form
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  initialData?: {
    id: string;
    nama_barang: string;
    kategori_id: string;
    kode_barang: string;
    keterangan: string;
  } | null;
}

export default function BarangDialogForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [nama_barang, setNama_barang] = useState("");
  const [kategori_id, setKategori_id] = useState("");
  const [kode_barang, setKode_barang] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset / isi default saat dialog dibuka
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setNama_barang(initialData.nama_barang);
        setKategori_id(initialData.kategori_id);
        setKode_barang(initialData.kode_barang);
        setKeterangan(initialData.keterangan);
      } else {
        setNama_barang("");
        setKategori_id("");
        setKode_barang("");
        setKeterangan("");
      }
      setError("");
    }
  }, [initialData, isEdit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { nama_barang, kategori_id, kode_barang, keterangan };
      const res = isEdit
        ? await axiosInstance.put(`/barang/${initialData?.id}`, payload)
        : await axiosInstance.post("/barang", payload);

      if (res.data?.status === "success") {
        onSuccess(res.data.message);
        const closeBtn = document.getElementById(
          "close-dialog-btn"
        ) as HTMLButtonElement;
        if (closeBtn) closeBtn.click();
      } else {
        setError("Gagal menyimpan data.");
      }
    } catch (err: unknown) {
      const errors = err?.response?.data?.errors;
      if (errors && typeof errors === "object") {
        const allMessages = Object.values(errors).join(" ");
        setError(allMessages);
      } else {
        const msg = err?.response?.data?.message || "Gagal menyimpan data.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Barang</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data barang di bawah ini
            </DialogDescription>
          </DialogHeader>

          {/* Alert error */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form input */}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Barang</Label>
              <Input
                id="nama"
                value={nama_barang}
                onChange={(e) => setNama_barang(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Kategori ID</Label>
              <Input
                id="kategori"
                value={kategori_id}
                onChange={(e) => setKategori_id(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode Barang</Label>
              <Input
                id="kode"
                value={kode_barang}
                onChange={(e) => setKode_barang(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </div>
          </div>

          {/* Tombol aksi */}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" id="close-dialog-btn">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
