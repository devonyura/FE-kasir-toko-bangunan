// src/components/barang/BarangDialogForm.tsx
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
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import KelolaKategoriDialog from "@/components/barang/KelolaKategoriDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string, id?: string) => void;
  initialData?: {
    id: string;
    nama_barang: string;
    kategori_id: string;
    kode_barang: string;
    keterangan: string;
  } | null;
}

interface Kategori {
  id: string;
  nama_kategori: string;
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
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tambahkan state dialog open
  const [kelolaKategoriOpen, setKelolaKategoriOpen] = useState(false);

  // Fetch list kategori
  const fetchKategori = async () => {
    try {
      const res = await axiosInstance.get("/kategori");
      if (res.data?.status === "success") {
        setKategoriList(res.data.data);
      }
    } catch {
      setKategoriList([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchKategori(); // muat kategori dulu
      setError("");

      if (!isEdit) {
        // reset form kalau mode tambah
        setNama_barang("");
        // setKategori_id(initialData.kategori_id ?? "");
        setKode_barang("");
        setKeterangan("");
      }
    }
  }, [open, isEdit, initialData?.kategori_id]);

  useEffect(() => {
    // setelah kategoriList siap dan open & edit mode, set nilai dari initialData
    if (open && isEdit && initialData && kategoriList.length > 0) {
      setNama_barang(initialData.nama_barang);
      setKategori_id(initialData.kategori_id);
      setKode_barang(initialData.kode_barang);
      setKeterangan(initialData.keterangan);
    }
  }, [open, isEdit, initialData, kategoriList]);

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
        const id = res.data?.data?.id;
        onSuccess(res.data.message, id);
        const closeBtn = document.getElementById(
          "close-dialog-btn"
        ) as HTMLButtonElement;
        if (closeBtn) closeBtn.click();
      } else {
        setError(res.data?.message || "Gagal menyimpan data.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data?.message || "Gagal menyimpan data.";
        if (errors && typeof errors === "object") {
          const allMessages = Object.values(errors).join(" ");
          setError(allMessages);
        } else {
          if (axios.isAxiosError(err)) {
            const msg = err.response?.data?.message || "Gagal menyimpan data.";
            setError(msg);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[500px]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Edit" : "Tambah"} Barang</DialogTitle>
              <DialogDescription>
                {isEdit ? "Ubah" : "Isi"} data barang di bawah ini
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
                <Label htmlFor="nama">Nama Barang</Label>
                <Input
                  id="nama"
                  value={nama_barang ?? ""}
                  onChange={(e) => setNama_barang(e.target.value)}
                  required
                />
              </div>

              {/* Select Kategori */}
              <div className="grid gap-2">
                <Label htmlFor="kategori">Kategori</Label>
                <div className="flex items-center justify-start gap-4">
                  <div className="flex-1 max-w-sm">
                    <Select
                      value={kategori_id || ""}
                      onValueChange={setKategori_id}
                      required
                    >
                      <SelectTrigger id="kategori">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategoriList.map((kategori) => (
                          <SelectItem key={kategori.id} value={kategori.id}>
                            {kategori.nama_kategori}
                          </SelectItem>
                          // {console.log(kategori.id)}
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setKelolaKategoriOpen(true)}
                  >
                    Kelola Kategori
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="kode">Kode Barang</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="kode"
                    value={kode_barang ?? ""}
                    onChange={(e) => setKode_barang(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const kode = generateKodeBarangEAN13();
                      setKode_barang(kode);
                    }}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

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
      <KelolaKategoriDialog
        open={kelolaKategoriOpen}
        onOpenChange={setKelolaKategoriOpen}
        onKategoriChange={fetchKategori}
      />
    </>
  );
}
