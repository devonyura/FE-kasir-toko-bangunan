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

// Tipe data
interface DetailBarang {
  barang_id: string;
  nama_barang: string;
  satuan_id: string;
  nama_satuan: string;
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
  };
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

  const [satuanList, setSatuanList] = useState<unknown[]>([]);
  const [satuanId, setSatuanId] = useState("");
  const [qty, setQty] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [error, setError] = useState("");

  const selectedSatuan = satuanList.find((s) => s.id === satuanId);
  console.log("satuanList:", satuanList);

  // Load satuan saat open
  useEffect(() => {
    if (open && barang?.id) {
      axiosInstance
        .get(`/satuan-barang/barang/${barang.id}`)
        .then((res) => setSatuanList(res.data.data || []));
    }
  }, [open, barang]);

  useEffect(() => {
    if (open && !initialData) {
      // Reset form saat mode tambah
      setSatuanId("");
      setQty("");
      setHargaBeli("");
      setSubtotal(0);
      setError("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (open) {
      if (isEdit && initialData) {
        setSatuanId(initialData.satuan_id);
        setQty(initialData.qty.toString());
        setHargaBeli(initialData.harga_beli.toString());
      } else {
        setSatuanId("");
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
    e.preventDefault();
    setError("");

    if (!satuanId || !qty || !hargaBeli) {
      setError("Semua field harus diisi.");
      return;
    }

    const result: DetailBarang = {
      barang_id: barang.id,
      nama_barang: barang.nama_barang,
      satuan_id: satuanId,
      nama_satuan: selectedSatuan?.nama_satuan || "-",
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
              Pilih satuan, isi jumlah dan harga beli
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

                  {/* ✅ Tabel satuan */}
                  <div className="overflow-x-auto mt-2">
                    <table className="w-full border text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Satuan</th>
                          <th className="border px-2 py-1">Harga Jual</th>
                          <th className="border px-2 py-1">Harga Beli</th>
                          <th className="border px-2 py-1">Konversi</th>
                          <th className="border px-2 py-1">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {satuanList.map((satuan) => {
                          const satuanDefault = satuanList.find(
                            (s) => Number(s.is_satuan_default) === 1
                          );
                          const konversiText =
                            Number(satuan.is_satuan_default) === 1
                              ? `1 ${satuan.nama_satuan}`
                              : `1 ${satuan.nama_satuan} = ${
                                  satuan.konversi_ke_satuan_dasar
                                } ${satuanDefault?.nama_satuan || "-"}`;

                          return (
                            <tr key={satuan.id}>
                              <td className="border px-2 py-1">
                                {satuan.nama_satuan}
                              </td>
                              <td className="border px-2 py-1">
                                {rupiahFormat(satuan.harga_jual)}
                              </td>
                              <td className="border px-2 py-1">
                                {rupiahFormat(satuan.harga_beli)}
                              </td>

                              {/* ✅ Konversi dinamis */}
                              <td className="border px-2 py-1">
                                {konversiText}
                              </td>

                              {/* ✅ Default ditentukan oleh angka 1/0 */}
                              {/* {console.log(satuan)} */}
                              <td className="border px-2 py-1 text-center">
                                {Number(satuan.is_satuan_default) === 1
                                  ? "✅"
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[0.65rem] mt-1 italic">
                    *Untuk Ubah data barang/satuan, buka menu <b>Data barang</b>
                    .
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
              <Label>Satuan</Label>
              <Select value={satuanId} onValueChange={setSatuanId} required>
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
