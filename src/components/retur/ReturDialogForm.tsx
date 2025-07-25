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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import axios from "axios";
import { toZonedTime, format } from "date-fns-tz";

// Tambahkan tipe ini di atas component
type TransaksiDetail = {
  id: number;
  barang_id: number;
  tipe_id: number;
  nama_barang: string;
  nama_tipe: string;
  qty: number;
  harga_jual?: number;
  harga_beli?: number;
  subtotal: number;
};

type PreviewTransaksi = {
  transaksi: {
    id: number;
    no_nota: string;
    tanggal: string;
    customer?: string;
    nama_supplier?: string;
    status: string;
    total: number;
    dibayar: number;
  };
  detail: TransaksiDetail[];
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (msg: string) => void;
}

type DetailBarang = {
  barang_id: number;
  tipe_id: number;
  nama_barang: string;
  nama_tipe: string;
};

export default function ReturDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  // const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("penjualan");
  const [noNota, setNoNota] = useState("");
  const [transaksiId, setTransaksiId] = useState(""); // hidden data
  const [barangTipeOptions, setBarangTipeOptions] = useState<DetailBarang[]>(
    []
  );
  const [selectedBarangTipe, setSelectedBarangTipe] = useState<string>("");

  const [qty, setQty] = useState("");
  const [alasan, setAlasan] = useState("");

  const [error, setError] = useState("");

  // preview nota state
  const [previewTransaksi, setPreviewTransaksi] =
    useState<PreviewTransaksi | null>(null);

  // Mengambil qty maksimum dari detail barang yang dipilih
  const getMaxQtyBarang = () => {
    if (
      !selectedBarangTipe ||
      !barangTipeOptions.length ||
      !previewTransaksi?.detail.length
    ) {
      return 0;
    }

    const [barangIdStr, tipeIdStr] = selectedBarangTipe.split("-");
    const barangId = parseInt(barangIdStr, 10);
    const tipeId = parseInt(tipeIdStr, 10);

    const found = previewTransaksi.detail.find(
      (d) => Number(d.barang_id) === barangId && Number(d.tipe_id) === tipeId
    );

    return found ? found.qty : 0;
  };

  useEffect(() => {
    if (open) {
      // const today = new Date().toISOString().slice(0, 10);
      // setTanggal(today);
      setJenis("penjualan");
      setNoNota("");
      setTransaksiId("");
      setBarangTipeOptions([]);
      setSelectedBarangTipe("");
      setQty("");
      setAlasan("");
      setError("");
      setPreviewTransaksi(null);
    }
  }, [open]);

  // Reset no nota saat jenis retur diubah
  useEffect(() => {
    setNoNota("");
    setTransaksiId("");
    setBarangTipeOptions([]);
    setSelectedBarangTipe("");
    setQty("");
    setAlasan("");
    setPreviewTransaksi(null);
    setError("");
  }, [jenis]);

  const handleCariTransaksi = async () => {
    try {
      const endpoint =
        jenis === "penjualan"
          ? `/transaksi-jual/${noNota}`
          : `/transaksi-beli/${noNota}`;

      const res = await axiosInstance.get(endpoint);
      const data = res.data.data;

      setTransaksiId(data.transaksi.id);
      setBarangTipeOptions(data.detail || []);
      setPreviewTransaksi(data);
      setError("");
    } catch (err) {
      setError(`Transaksi tidak ditemukan. Periksa nomor nota: ${err}`);
      setBarangTipeOptions([]);
      setPreviewTransaksi(null);
    }

  };

  const handleSubmit = async () => {
    try {
      const [barang_id, tipe_id] = selectedBarangTipe
        .split("-")
        .map((val) => parseInt(val));

      const qtyNum = Number(qty);
      const maxQty = getMaxQtyBarang();

      if (qtyNum <= 0) {
        setError("Qty harus lebih dari 0.");
        return;
      }

      if (qtyNum > maxQty) {
        setError(`Qty tidak boleh lebih dari jumlah pembelian (${maxQty}).`);
        return;
      }

      const timeZone = "Asia/Shanghai";
      const now = new Date();
      const zonedDate = toZonedTime(now, timeZone);
      const tanggalLengkap = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
        timeZone,
      });

      const payload = {
        jenis,
        transaksi_id: transaksiId,
        no_nota: noNota,
        barang_id,
        tipe_id,
        qty: Number(qty),
        alasan,
        tanggal: tanggalLengkap,
      };
      console.log(payload);
      await axiosInstance.post("/retur", payload);
      onSuccess("Retur berhasil disimpan.");
      onOpenChange(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log(err);
        const msg = err?.response?.data?.message || "Gagal menyimpan retur.";
        setError(msg);
      }
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto"
        aria-describedby=""
      >
        <DialogHeader>
          <DialogTitle>Tambah Retur Barang</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {/* <div>
            <Label className="mb-1">Tanggal</Label>
            <Input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div> */}

          <div>
            <Label className="mb-1">Jenis Retur</Label>
            <Select value={jenis} onValueChange={(val) => setJenis(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis retur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="penjualan">Penjualan</SelectItem>
                <SelectItem value="pembelian">Pembelian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1">No Nota</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Contoh: NJ-20250507-283 atau NB-20250507-283"
                value={noNota}
                onChange={(e) => setNoNota(e.target.value)}
              />
              <Button type="button" onClick={handleCariTransaksi}>
                Cari
              </Button>
            </div>
          </div>

          {previewTransaksi && (
            <div className="border p-3 rounded bg-muted mt-2 space-y-2">
              <div className="text-sm font-semibold">Informasi Transaksi</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  No Nota:{" "}
                  <span className="font-medium">
                    {previewTransaksi.transaksi.no_nota}
                  </span>
                </p>
                <p>
                  Tanggal:{" "}
                  <span className="font-medium">
                    {previewTransaksi.transaksi.tanggal.slice(0, 10)}
                  </span>
                </p>
                {previewTransaksi.transaksi.customer ? (
                  <p>
                    Customer:{" "}
                    <span className="font-medium">
                      {previewTransaksi.transaksi.customer}
                    </span>
                  </p>
                ) : (
                  <p>
                    Supplier:{" "}
                    <span className="font-medium">
                      {previewTransaksi.transaksi.nama_supplier}
                    </span>
                  </p>
                )}
                <p>
                  Status:{" "}
                  <span className="font-medium">
                    {previewTransaksi.transaksi.status}
                  </span>
                </p>
                <p>
                  Total:{" "}
                  <span className="font-medium">
                    Rp
                    {Number(previewTransaksi.transaksi.total).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </p>
                <p>
                  Dibayar:{" "}
                  <span className="font-medium">
                    Rp
                    {Number(previewTransaksi.transaksi.dibayar).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </p>
              </div>

              <div className="text-sm font-semibold mt-3">Detail Barang</div>
              <div className="overflow-auto">
                <table className="w-full text-sm border mt-1">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Nama Barang</th>
                      <th className="border px-2 py-1">Tipe</th>
                      <th className="border px-2 py-1">Qty</th>
                      <th className="border px-2 py-1">Harga</th>
                      <th className="border px-2 py-1">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewTransaksi.detail.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="border px-2 py-1">{idx + 1}</td>
                        <td className="border px-2 py-1">{item.nama_barang}</td>
                        <td className="border px-2 py-1">{item.nama_tipe}</td>
                        <td className="border px-2 py-1">{item.qty}</td>
                        <td className="border px-2 py-1">
                          Rp
                          {Number(
                            jenis === "penjualan"
                              ? item.harga_jual
                              : item.harga_beli
                          ).toLocaleString("id-ID")}
                        </td>
                        <td className="border px-2 py-1">
                          Rp{Number(item.subtotal).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <Label className="mb-1">Pilih Barang</Label>
            <Select
              value={selectedBarangTipe}
              onValueChange={setSelectedBarangTipe}
              disabled={!previewTransaksi}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih barang" />
              </SelectTrigger>
              <SelectContent>
                {barangTipeOptions.map((item) => (
                  <SelectItem
                    key={`${item.barang_id}-${item.tipe_id}`}
                    value={`${item.barang_id}-${item.tipe_id}`}
                  >
                    {item.nama_barang} ({item.nama_tipe})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1">Qty</Label>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              disabled={!previewTransaksi}
              placeholder={`Max: ${getMaxQtyBarang()}`}
              max={getMaxQtyBarang()}
            />
          </div>

          <div>
            <Label className="mb-1">Alasan Retur</Label>
            <Input
              placeholder="Contoh: Barang rusak, expired..."
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              disabled={!previewTransaksi}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
