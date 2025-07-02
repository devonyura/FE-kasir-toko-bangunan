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
import axios from "axios";

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

interface Tipe {
  id: string;
  nama_tipe: string;
}

export default function StokKeluarDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [barangId, setBarangId] = useState("");
  const [tipeId, setTipeId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [tipeList, setTipeList] = useState<Tipe[]>([]);
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
    setTipeId("");
    setTanggal("");
    setJumlah("");
    setKeterangan("");
    setTipeList([]);
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

  const fetchTipe = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/tipe-barang/barang/${id}`);
      setTipeList(res.data.data || []);
    } catch {
      setTipeList([]);
    }
  };

  const handleSubmit = async () => {
    if (!barangId || !tipeId || !tanggal || !jumlah) {
      setError("Semua field wajib diisi.");
      return;
    }
    const now = new Date();
    const jamSekarang = now.toTimeString().split(" ")[0]; // contoh: "21:47:22"
    const tanggalLengkap = `${tanggal} ${jamSekarang}`;
    try {
      const payload = {
        barang_id: Number(barangId),
        tipe_id: Number(tipeId),
        tanggal: tanggalLengkap,
        jumlah: Number(jumlah),
        keterangan,
        jenis: "keluar", // hanya ini bedanya
        user_id: userId,
      };
      console.log(payload);
      await axiosInstance.post("/stok", payload);
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err?.response?.data?.message || "Gagal menyimpan stok keluar.";
        setError(msg);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby="">
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
                fetchTipe(val);
                setTipeId("");
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
            <Label>Tipe</Label>
            <Select value={tipeId} onValueChange={setTipeId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                {tipeList.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.nama_tipe}
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
