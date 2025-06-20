import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Barang {
  id: string;
  nama_barang: string;
  nama_kategori: string;
}

interface Satuan {
  id: string;
  nama_satuan: string;
}

export default function StokKeluarDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [barangId, setBarangId] = useState("");
  const [satuanId, setSatuanId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [error, setError] = useState("");
  const userId = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state
    ?.user?.id;

  useEffect(() => {
    if (open) {
      fetchBarang();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setBarangId("");
    setSatuanId("");
    setTanggal("");
    setJumlah("");
    setKeterangan("");
    setSatuanList([]);
    setError("");
  };

  const fetchBarang = async () => {
    try {
      const res = await axiosInstance.get("/barang");
      setBarangList(res.data.data || []);
    } catch {
      setBarangList([]);
    }
  };

  const fetchSatuan = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/satuan-barang/barang/${id}`);
      setSatuanList(res.data.data || []);
    } catch {
      setSatuanList([]);
    }
  };

  const handleSubmit = async () => {
    if (!barangId || !satuanId || !tanggal || !jumlah) {
      setError("Semua field wajib diisi.");
      return;
    }

    try {
      const payload = {
        barang_id: Number(barangId),
        satuan_id: Number(satuanId),
        tanggal,
        jumlah: Number(jumlah),
        keterangan,
        jenis: "keluar", // hanya ini bedanya
        user_id: userId,
      };

      await axiosInstance.post("/stok", payload);
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        err?.response?.data?.message || "Gagal menyimpan stok keluar.";
      setError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Input Stok Keluar</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Barang</Label>
            <Select
              value={barangId}
              onValueChange={(val) => {
                setBarangId(val);
                fetchSatuan(val);
                setSatuanId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Barang" />
              </SelectTrigger>
              <SelectContent>
                {barangList.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.nama_barang} ({b.nama_kategori})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Satuan</Label>
            <Select value={satuanId} onValueChange={setSatuanId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Satuan" />
              </SelectTrigger>
              <SelectContent>
                {satuanList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama_satuan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Tanggal</Label>
            <Input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Jumlah</Label>
            <Input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Keterangan</Label>
            <Textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Batal
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
