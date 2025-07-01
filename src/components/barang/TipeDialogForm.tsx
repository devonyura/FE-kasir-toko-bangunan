import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CalculatorDialog from "../common/CalculatorDialog";
// import {  } from "ca";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangId: string;
  onSuccess: (message: string) => void;
  initialData?: {
    id: string;
    nama_tipe: string;
    harga_jual: string;
    harga_beli: string;
  } | null;
}

export default function TipeDialogForm({
  open,
  onOpenChange,
  barangId,
  onSuccess,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [nama, setNama] = useState("");
  const [jual, setJual] = useState("");
  const [beli, setBeli] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [namaError, setNamaError] = useState("");

  const [openCal, setOpenCal] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNama(initialData.nama_tipe);
        setJual(initialData.harga_jual);
        setBeli(initialData.harga_beli);
      } else {
        setNama("");
        setJual("");
        setBeli("");
      }
      setError("");
    }
  }, [open, initialData, barangId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNamaError(""); // Clear jika valid

    setError("");
    setLoading(true);

    try {
      const payload = {
        barang_id: barangId,
        nama_tipe: nama,
        harga_jual: parseFloat(jual),
        harga_beli: parseFloat(beli),
      };

      const res = isEdit
        ? await axiosInstance.put(`/tipe-barang/${initialData?.id}`, payload)
        : await axiosInstance.post("/tipe-barang", payload);

      if (res.data?.status === "success") {
        onSuccess(res.data.message);
        onOpenChange(false);
      } else {
        setError("Gagal menyimpan tipe.");
      }
    } catch (err: unknown) {
      const msg = err?.response?.data?.message || "Gagal menyimpan tipe.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        {/* Komponen kalkulator */}
        <CalculatorDialog open={openCal} onOpenChange={setOpenCal} />
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Tipe</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data tipe barang.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Tipe</Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
                aria-invalid={!!namaError}
                aria-describedby="nama-error"
                className={
                  namaError ? "border-red-500 focus-visible:ring-red-500" : ""
                }
              />
              {namaError && (
                <p id="nama-error" className="text-sm text-red-500">
                  {namaError}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beli">Harga Beli (modal)</Label>
              <Input
                type="number"
                value={beli}
                onChange={(e) => setBeli(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jual">Harga Jual </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={jual}
                  className="flex-1"
                  onChange={(e) => setJual(e.target.value)}
                  required
                />
              </div>
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
