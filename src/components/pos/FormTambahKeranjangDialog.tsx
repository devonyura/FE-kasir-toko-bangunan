// src/components/pos/FormTambahKeranjangDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barang: {
    id: string;
    nama_barang: string;
    nama_kategori: string;
  } | null;
  onAddToCart: (item: KeranjangItem) => void;
  initialData?: KeranjangItem | null;
}

interface Satuan {
  id: string;
  nama_satuan: string;
  harga_jual: number;
}

export interface KeranjangItem {
  barang_id: string;
  nama_barang: string;
  satuan_id: string;
  nama_satuan: string;
  qty: number;
  harga_jual: number;
  subtotal: number;
}

export default function FormTambahKeranjangDialog({
  open,
  onOpenChange,
  barang,
  onAddToCart,
  initialData = null,
}: Props) {
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [satuanId, setSatuanId] = useState("");
  const [qty, setQty] = useState("1");
  const [harga, setHarga] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");

  const selectedSatuan = satuanList.find((s) => s.id === satuanId);

  // Ambil satuan dari barang
  useEffect(() => {
    if (open && barang?.id) {
      axiosInstance.get(`/satuan-barang/barang/${barang.id}`).then((res) => {
        const data = res.data.data || [];
        setSatuanList(data);

        if (initialData) {
          // Mode edit
          setSatuanId(initialData.satuan_id);
          setQty(initialData.qty.toString());
          setHarga(initialData.harga_jual.toString());
        } else {
          // Mode tambah
          if (data.length > 0) {
            setSatuanId(data[0].id);
            setHarga(data[0].harga_jual.toString());
          }
          setQty("1");
        }

        setError("");
      });
    }
  }, [open, barang, initialData]);

  // Update subtotal saat qty atau harga berubah
  useEffect(() => {
    const q = parseFloat(qty);
    const h = parseFloat(harga);
    setSubtotal(!isNaN(q) && !isNaN(h) ? q * h : 0);
  }, [qty, harga]);

  const handleSubmit = () => {
    if (!satuanId || !qty || !harga) {
      setError("Semua field harus diisi.");
      return;
    }

    onAddToCart({
      barang_id: barang!.id,
      nama_barang: barang!.nama_barang,
      satuan_id: satuanId,
      nama_satuan: selectedSatuan?.nama_satuan || "-",
      qty: parseFloat(qty),
      harga_jual: parseFloat(harga),
      subtotal,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby="">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? "Edit Barang di Keranjang"
              : `Tambah ke Keranjang: ${barang?.nama_barang}`}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-2">
          {/* Satuan */}
          <div className="grid gap-2">
            <Label>Satuan</Label>
            <Select
              value={satuanId}
              onValueChange={(val) => {
                setSatuanId(val);
                const satuan = satuanList.find((s) => s.id === val);
                setHarga(satuan?.harga_jual.toString() || "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih satuan" />
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

          {/* Qty */}
          <div className="grid gap-2">
            <Label>Jumlah</Label>
            <Input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          {/* Harga */}
          <div className="grid gap-2">
            <Label>Harga</Label>
            <Input
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
            />
          </div>

          {/* Subtotal */}
          <div className="grid gap-2">
            <Label>Subtotal</Label>
            <Input value={subtotal.toLocaleString()} readOnly />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            {initialData ? "Simpan Perubahan" : "Tambah ke Keranjang"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
