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
import { rupiahFormat } from "@/utils/formatting";
import CurrencyInput from "@/components/ui/CurrencyInput"; // ✅ Import baru


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

  // Hitung selisih
  const selisih = parseFloat(jual || "0") - parseFloat(beli || "0");

  const generateKodeBarangEAN13 = () => {
    const prefix = "899";
    const randomDigits = Math.floor(Math.random() * 1_000_000_000)
      .toString()
      .padStart(9, "0");
    const baseCode = prefix + randomDigits;
    const sum = baseCode
      .split("")
      .map((digit, idx) => parseInt(digit) * (idx % 2 === 0 ? 1 : 3))
      .reduce((a, b) => a + b, 0);
    const checkDigit = (10 - (sum % 10)) % 10;
    return baseCode + checkDigit;
  };

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNama(initialData.nama_tipe);

        // Hapus angka belakang koma jika ada
        const jualClean = Math.floor(parseFloat(initialData.harga_jual)).toString();
        const beliClean = Math.floor(parseFloat(initialData.harga_beli)).toString();

        setJual(jualClean);
        setBeli(beliClean);

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

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 2500)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNamaError("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        barang_id: barangId,
        nama_tipe: nama,
        harga_jual: parseFloat(jual),
        harga_beli: parseFloat(beli),
        selisih: selisih,
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
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Tipe</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data tipe barang.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
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
              <Label htmlFor="beli">Harga Beli (Modal)</Label>
              {/* <Input
                type="number"
                value={beli}
                onChange={(e) => setBeli(e.target.value)}
                required
              /> */}
              <CurrencyInput value={beli} onChange={setBeli} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jual">Harga Jual</Label>
              {/* <Input
                type="number"
                value={jual}
                onChange={(e) => setJual(e.target.value)}
                required
              /> */}
              <CurrencyInput value={jual} onChange={setJual} />

            </div>

            <div className="text-lg font-medium text-green-600">
              Selisih: {rupiahFormat(selisih)}
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
                  disabled={isEdit}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!isEdit) {
                      const kode = generateKodeBarangEAN13();
                      setKode_barang_tipe(kode);
                    } else {
                      setError("Kode barang tidak boleh di edit!");
                    }
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
