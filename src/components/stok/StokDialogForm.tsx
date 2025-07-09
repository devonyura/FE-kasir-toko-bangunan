import { useEffect, useState, useRef } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import axios from "axios";
import { toZonedTime, format } from "date-fns-tz";
import { cn } from "@/lib/utils";

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

export default function StokDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [barangId, setBarangId] = useState("");
  const [tipeId, setTipeId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tipeList, setTipeList] = useState<Tipe[]>([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Barang[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debounceRef = useRef<number>(0);

  const userId = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state
    ?.user?.id;

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setBarangId("");
    setTipeId("");
    setJumlah("");
    setKeterangan("");
    setTipeList([]);
    setError("");
    setSearchQuery("");
    setSearchResults([]);
  };

  const fetchBarang = async (query: string) => {
    try {
      setLoadingSearch(true);
      const res = await axiosInstance.get(`/barang?search=${query}`);
      setSearchResults(res.data.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
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

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchBarang(searchQuery.trim());
    }, 300);
  }, [searchQuery]);

  const handleSelectBarang = (barang: Barang) => {
    setBarangId(barang.id);
    setSearchQuery(`${barang.nama_barang} (${barang.nama_kategori})`);
    setSearchResults([]);
    fetchTipe(barang.id);
    setTipeId("");
  };

  const handleSubmit = async () => {
    if (!barangId || !tipeId || !jumlah) {
      setError("Semua field wajib diisi.");
      return;
    }

    const timeZone = "Asia/Shanghai";
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const tanggalLengkap = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
      timeZone,
    });

    try {
      const payload = {
        barang_id: Number(barangId),
        tipe_id: Number(tipeId),
        tanggal: tanggalLengkap,
        jumlah: Number(jumlah),
        keterangan,
        jenis: "masuk",
        user_id: userId,
      };

      await axiosInstance.post("/stok/masuk", payload);
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err?.response?.data?.message || "Gagal menyimpan data stok.";
        setError(msg);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Input Stok Masuk</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-2">
          {/* ✅ Barang Autocomplete */}
          <div className="grid gap-2 relative">
            <Label>Cari Barang</Label>
            <Input
              placeholder="Cari nama barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {loadingSearch && (
              <p className="text-sm text-muted-foreground">Memuat...</p>
            )}
            {searchResults.length > 0 && (
              <ul className="absolute z-50 mt-1 bg-white border rounded shadow w-full max-h-60 overflow-y-auto text-sm">
                {searchResults.map((b) => (
                  <li
                    key={b.id}
                    className={cn("px-3 py-2 cursor-pointer hover:bg-muted")}
                    onMouseDown={() => handleSelectBarang(b)}
                  >
                    {b.nama_barang} ({b.nama_kategori})
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tipe */}
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

          {/* Jumlah */}
          <div className="grid gap-2">
            <Label>Jumlah</Label>
            <Input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </div>

          {/* Keterangan */}
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
