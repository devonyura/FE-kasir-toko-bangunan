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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (msg: string) => void;
}

type DetailBarang = {
  barang_id: number;
  satuan_id: number;
  nama_barang: string;
  nama_satuan: string;
};

export default function ReturDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [tanggal, setTanggal] = useState("");
  const [jenis, setJenis] = useState("penjualan");
  const [noNota, setNoNota] = useState("");
  const [transaksiId, setTransaksiId] = useState(""); // hidden data
  const [barangSatuanOptions, setBarangSatuanOptions] = useState<
    DetailBarang[]
  >([]);
  const [selectedBarangSatuan, setSelectedBarangSatuan] = useState<string>("");

  const [qty, setQty] = useState("");
  const [alasan, setAlasan] = useState("");

  const [error, setError] = useState("");

  // preview nota state
  const [previewTransaksi, setPreviewTransaksi] = useState<undefined>(null);

  // Mengambil qty maksimum dari detail barang yang dipilih
  const getMaxQtyBarang = () => {
    if (!selectedBarangSatuan || !barangSatuanOptions.length) return 0;

    const [barang_id, satuan_id] = selectedBarangSatuan
      .split("-")
      .map((v) => parseInt(v));

    const found = barangSatuanOptions.find(
      (item) => item.barang_id == barang_id && item.satuan_id == satuan_id
    );

    return found
      ? parseFloat(
          (previewTransaksi?.detail || []).find(
            (d: undefined) =>
              d.barang_id == barang_id && d.satuan_id == satuan_id
          )?.qty || "0"
        )
      : 0;
  };

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().slice(0, 10);
      setTanggal(today);
      setJenis("penjualan");
      setNoNota("");
      setTransaksiId("");
      setBarangSatuanOptions([]);
      setSelectedBarangSatuan("");
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
    setBarangSatuanOptions([]);
    setSelectedBarangSatuan("");
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
      setBarangSatuanOptions(data.detail || []);
      setPreviewTransaksi(data);
      setError("");
    } catch (err: undefined) {
      setError(`Transaksi tidak ditemukan. Periksa nomor nota: ${err}`);
      setBarangSatuanOptions([]);
      setPreviewTransaksi(null);
    }
  };

  const handleSubmit = async () => {
    try {
      const [barang_id, satuan_id] = selectedBarangSatuan
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

      // Format tanggal ke "YYYY-MM-DD HH:mm:ss"
      const tanggal = new Date().toISOString().slice(0, 10);
      const now = new Date();
      const jamSekarang = now.toTimeString().split(" ")[0]; // contoh: "21:47:22"
      const tanggalLengkap = `${tanggal} ${jamSekarang}`;

      const payload = {
        jenis,
        transaksi_id: transaksiId,
        no_nota: noNota,
        barang_id,
        satuan_id,
        qty: Number(qty),
        alasan,
        tanggal: tanggalLengkap,
      };
      console.log(payload);
      await axiosInstance.post("/retur", payload);
      onSuccess("Retur berhasil disimpan.");
      onOpenChange(false);
    } catch (err) {
      console.log(err);
      const msg = err?.response?.data?.message || "Gagal menyimpan retur.";
      setError(msg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
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
          <div>
            <Label className="mb-1">Tanggal</Label>
            <Input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>

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
                <p>
                  Customer:{" "}
                  <span className="font-medium">
                    {previewTransaksi.transaksi.customer}
                  </span>
                </p>
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
                      <th className="border px-2 py-1">Satuan</th>
                      <th className="border px-2 py-1">Qty</th>
                      <th className="border px-2 py-1">Harga</th>
                      <th className="border px-2 py-1">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewTransaksi.detail.map(
                      (item: undefined, idx: number) => (
                        <tr key={item.id}>
                          <td className="border px-2 py-1">{idx + 1}</td>
                          <td className="border px-2 py-1">
                            {item.nama_barang}
                          </td>
                          <td className="border px-2 py-1">
                            {item.nama_satuan}
                          </td>
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
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <Label className="mb-1">Pilih Barang</Label>
            <Select
              value={selectedBarangSatuan}
              onValueChange={setSelectedBarangSatuan}
              disabled={!previewTransaksi}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih barang" />
              </SelectTrigger>
              <SelectContent>
                {barangSatuanOptions.map((item) => (
                  <SelectItem
                    key={`${item.barang_id}-${item.satuan_id}`}
                    value={`${item.barang_id}-${item.satuan_id}`}
                  >
                    {item.nama_barang} ({item.nama_satuan})
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
