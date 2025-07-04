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
import axios from "axios";
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
    kode_barang_tipe: string;
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
  const [kode_barang_tipe, setKode_barang_tipe] = useState("");

  const generateKodeBarangEAN13 = () => {
    // Buat 12 digit awal (bisa pakai prefix tertentu jika mau, contoh: "899" untuk produk Indonesia)
    const prefix = "899"; // optional prefix
    const randomDigits = Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, "0"); // 9 digit acak
    const baseCode = prefix + randomDigits; // total 12 digit

    // Hitung checksum EAN13
    const sum = baseCode
      .split("")
      .map((digit, idx) => parseInt(digit) * (idx % 2 === 0 ? 1 : 3))
      .reduce((a, b) => a + b, 0);

    const checkDigit = (10 - (sum % 10)) % 10;

    return baseCode + checkDigit; // hasil akhir 13 digit EAN13
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNama(initialData.nama_tipe);
        setJual(initialData.harga_jual);
        setBeli(initialData.harga_beli);
        setKode_barang_tipe(initialData.kode_barang_tipe);
      } else {
        setNama("");
        setJual("");
        setBeli("");
        setKode_barang_tipe("");
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
        kode_barang_tipe: kode_barang_tipe,
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
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.message || "Gagal menyimpan tipe.";
        setError(msg);
      }
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Tipe</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data tipe barang.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              {/* <AlertCircleIcon className="h-5 w-5" /> */}
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
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode Barang</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="kode"
                  value={kode_barang_tipe ?? ""}
                  onChange={(e) => setKode_barang_tipe(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const kode = generateKodeBarangEAN13();
                    setKode_barang_tipe(kode);
                  }}
                >
                  Generate
                </Button>
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
