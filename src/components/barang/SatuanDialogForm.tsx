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
import { AlertCircleIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangId: string;
  onSuccess: (message: string) => void;
  initialData?: {
    id: string;
    nama_satuan: string;
    harga_jual: string;
    harga_beli: string;
    konversi_ke_satuan_dasar: number;
    is_satuan_default: number;
  } | null;
}

export default function SatuanDialogForm({
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
  const [konversi, setKonversi] = useState("1");
  const [isDefault, setIsDefault] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [namaError, setNamaError] = useState("");

  const [defaultSatuanNama, setDefaultSatuanNama] = useState("");

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNama(initialData.nama_satuan);
        setJual(initialData.harga_jual);
        setBeli(initialData.harga_beli);
        setKonversi(initialData.konversi_ke_satuan_dasar.toString());
        setIsDefault(Number(initialData.is_satuan_default) === 1 ? 1 : 0);

        //  🔁 Cek satuan default barang dari backend
        axiosInstance.get(`/satuan-barang/barang/${barangId}`).then((res) => {
          const defaultSatuan = res.data?.data?.find(
            (s: undefined) => Number(s.is_satuan_default) === 1
          );
          if (defaultSatuan) setDefaultSatuanNama(defaultSatuan.nama_satuan);
        });
      } else {
        setNama("");
        setJual("");
        setBeli("");
        setKonversi("1");
        setIsDefault(0);
      }
      setError("");
    }
  }, [open, initialData, barangId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]+$/.test(nama)) {
      setNamaError("Nama satuan tidak boleh mengandung angka.");
      setLoading(false);
      return;
    }
    setNamaError(""); // Clear jika valid

    setError("");
    setLoading(true);

    try {
      // ✅ Validasi: hanya boleh 1 default satuan
      if (isDefault === 1) {
        const resCheck = await axiosInstance.get(
          `/satuan-barang/barang/${barangId}`
        );
        const existingDefaults = resCheck.data.data?.filter(
          (item: unknown) =>
            Number(item.is_satuan_default) === 1 &&
            (!isEdit || item.id !== initialData?.id)
        );

        if (existingDefaults.length > 0) {
          setError("Sudah ada satuan default untuk barang ini.");
          setLoading(false);
          return;
        }
      }

      const payload = {
        barang_id: barangId,
        nama_satuan: nama,
        harga_jual: parseFloat(jual),
        harga_beli: parseFloat(beli),
        konversi_ke_satuan_dasar: parseFloat(konversi),
        is_satuan_default: isDefault,
      };

      const res = isEdit
        ? await axiosInstance.put(`/satuan-barang/${initialData?.id}`, payload)
        : await axiosInstance.post("/satuan-barang", payload);

      if (res.data?.status === "success") {
        onSuccess(res.data.message);
        onOpenChange(false);
      } else {
        setError("Gagal menyimpan satuan.");
      }
    } catch (err: unknown) {
      const msg = err?.response?.data?.message || "Gagal menyimpan satuan.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // dynamic label info for konversi
  const konversiLabel =
    isDefault === 1
      ? `Satuan dasar kamu sekarang adalah ${nama || "-"}`
      : `Konversi ke satuan dasar (1 ${nama || "?"} = ${konversi || "?"} ${
          defaultSatuanNama || "-"
        })`;
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
            <DialogTitle>{isEdit ? "Edit" : "Tambah"} Satuan</DialogTitle>
            <DialogDescription>
              {isEdit ? "Ubah" : "Isi"} data satuan barang.
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
              <Label htmlFor="nama">Nama Satuan</Label>
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
              <Label htmlFor="jual">Harga Jual</Label>
              <Input
                type="number"
                value={jual}
                onChange={(e) => setJual(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="beli">Harga Beli</Label>
              <Input
                type="number"
                value={beli}
                onChange={(e) => setBeli(e.target.value)}
                required
              />
            </div>
            {isEdit && (
              <>
                <div
                  className="grid gap-2"
                  style={isDefault === 1 ? { display: "none" } : undefined}
                >
                  <Label htmlFor="konversi">{konversiLabel}</Label>
                  <Input
                    type="number"
                    value={konversi}
                    onChange={(e) => setKonversi(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDefault === 1}
                    onChange={(e) => setIsDefault(e.target.checked ? 1 : 0)}
                  />
                  <Label>Jadikan satuan default</Label>
                </div>
              </>
            )}
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
