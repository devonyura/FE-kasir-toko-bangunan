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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import { rupiahFormat } from "@/utils/formatting";

interface TipeBarang {
  id: string;
  nama_tipe: string;
  harga_jual: number;
  harga_beli: number;
}

// Tipe data
interface DetailBarang {
  barang_id: string;
  nama_barang: string;
  tipe_id: string;
  nama_tipe: string;
  qty: number;
  harga_beli: number;
  subtotal: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barang: {
    id: string;
    nama_barang: string;
    nama_kategori: string;
    kode_barang: string;
  } | null;
  initialData?: DetailBarang | null;
  onAdd: (detail: DetailBarang) => void;
}

export default function PilihBarangDialogForm({
  open,
  onOpenChange,
  barang,
  initialData,
  onAdd,
}: Props) {
  const isEdit = !!initialData;
  console.log("initialData:", initialData);

  const [tipeList, setTipeList] = useState<TipeBarang[]>([]);
  const [tipeId, setTipeId] = useState("");
  const [qty, setQty] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");

  const selectedTipe = tipeList.find((s) => s.id === tipeId);
  console.log("tipeList:", tipeList);

  // Load tipe saat open
  useEffect(() => {
    if (open && barang?.id) {
      axiosInstance
        .get(`/tipe-barang/barang/${barang.id}`)
        .then((res) => setTipeList(res.data.data || []));
    }
  }, [open, barang]);
  // Set otomatis harga beli saat tipe berubah
  useEffect(() => {
    if (tipeId) {
      const tipeTerpilih = tipeList.find((s) => s.id === tipeId);
      if (tipeTerpilih && !isNaN(tipeTerpilih.harga_beli)) {
        setHargaBeli(Math.round(tipeTerpilih.harga_beli).toString());
      }
    }
  }, [tipeId, tipeList]);

  useEffect(() => {
    if (open && !initialData) {
      // Reset form saat mode tambah
      setTipeId("");
      setQty("");
      setHargaBeli("");
      setSubtotal(0);
      setError("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setTipeId(initialData.tipe_id);
        setQty(initialData.qty.toString());
        setHargaBeli(initialData.harga_beli.toString());
      } else {
        setTipeId("");
        setQty("");
        setHargaBeli("");
        setSubtotal(0);
      }
      setError("");
    }
  }, [open, isEdit, initialData]);

  // Hitung subtotal
  useEffect(() => {
    const qtyNum = parseFloat(qty);
    const hargaNum = parseFloat(hargaBeli);
    if (!isNaN(qtyNum) && !isNaN(hargaNum)) {
      setSubtotal(qtyNum * hargaNum);
    } else {
      setSubtotal(0);
    }
  }, [qty, hargaBeli]);

  const handleSubmit = (e: React.FormEvent) => {
    if (!barang) {
      setError("Barang belum dipilih.");
      return;
    }
    e.preventDefault();
    setError("");

    if (!tipeId || !qty || !hargaBeli) {
      setError("Semua field harus diisi.");
      return;
    }

    const result: DetailBarang = {
      barang_id: barang?.id,
      nama_barang: barang?.nama_barang,
      tipe_id: tipeId,
      nama_tipe: selectedTipe?.nama_tipe || "-",
      qty: parseFloat(qty),
      harga_beli: parseFloat(hargaBeli),
      subtotal,
    };
    onAdd(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEdit
                ? "Edit Barang di Transaksi"
                : "Tambah Barang ke Transaksi"}
            </DialogTitle>
            <DialogDescription>
              Pilih tipe, isi jumlah dan harga beli
              {barang && (
                <div className="mb-1 mt-2 text-sm text-gray-600">
                  <h2 className="font-bold text-gray-700 text-[1.1rem]">
                    Info Barang Terkini:
                  </h2>
                  <p className="text-[1rem]">
                    <span className="font-semibold">Nama Barang:</span>{" "}
                    {barang.nama_barang}
                  </p>
                  <p className="text-[1rem]">
                    <span className="font-semibold">Kode Barang:</span>{" "}
                    {barang.kode_barang}
                  </p>

                  {/* ✅ Tabel tipe */}
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Tipe</th>
                          <th className="border px-2 py-1">
                            Harga Jual (Modal)
                          </th>
                          <th className="border px-2 py-1">Harga Beli</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tipeList.map((tipe) => {
                          return (
                            <tr key={tipe.id}>
                              <td className="border px-2 py-1">
                                {tipe.nama_tipe}
                              </td>
                              <td className="border px-2 py-1">
                                {rupiahFormat(tipe.harga_jual)}
                              </td>
                              <td className="border px-2 py-1">
                                {rupiahFormat(tipe.harga_beli)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[0.65rem] mt-1 italic">
                    *Untuk Ubah data barang/tipe, buka menu <b>Data barang</b>.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2 py-2">
            <SelectSeparator></SelectSeparator>
            <div className="grid gap-2">
              <Label>Tipe</Label>
              <Select value={tipeId} onValueChange={setTipeId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
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
              <Label>Harga Beli</Label>
              <Input
                type="number"
                value={hargaBeli}
                onChange={(e) => setHargaBeli(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <p className="text-[1.3rem] text-gray-700 mt-2">
                <b>Subtotal:</b> {rupiahFormat(subtotal)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit">{isEdit ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
