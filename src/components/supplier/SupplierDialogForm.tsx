// src/components/supplier/SupplierDialogForm.tsx

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    nama_supplier: string;
    alamat: string;
    telepon: string;
  } | null;
}

export default function SupplierDialogForm({
  open,
  onOpenChange,
  onSuccess,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Isi form jika mode edit
  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setNama(initialData.nama_supplier);
        setAlamat(initialData.alamat);
        setTelepon(initialData.telepon);
      } else {
        setNama("");
        setAlamat("");
        setTelepon("");
      }
      setError("");
    }
  }, [open, initialData, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        nama_supplier: nama,
        alamat,
        telepon,
      };

      const res = isEdit
        ? await axiosInstance.put(`/supplier/${initialData?.id}`, payload)
        : await axiosInstance.post("/supplier", payload);

      if (res.data?.status === "success") {
        onSuccess();
      } else {
        setError("Gagal menyimpan supplier.");
      }
    } catch (err: unknown) {
      const errors = err?.response?.data?.errors;
      if (errors && typeof errors === "object") {
        const allMessages = Object.values(errors).join(" ");
        setError(allMessages);
      } else {
        const msg = err?.response?.data?.message || "Gagal menyimpan supplier.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Supplier</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data supplier berikut.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal Menyimpan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Supplier</Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="alamat">Alamat</Label>
              <Input
                id="alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telepon">Telepon</Label>
              <Input
                id="telepon"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
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
