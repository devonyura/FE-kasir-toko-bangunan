// File: src/components/transaksi-beli/TransaksiBeliDialogForm.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import KelolaSupplierDialog from "@/components/supplier/KelolaSupplierDialog";
import PilihBarangDialogForm from "@/components/transaksi-beli/PilihBarangDialogForm";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, PencilIcon, TrashIcon } from "lucide-react";
import { rupiahFormat } from "@/utils/formatting";
import ConfirmDialog from "../common/ConfirmDialog";

// Tipe data
interface Supplier {
  id: string;
  nama_supplier: string;
}

interface DetailBarang {
  id?: string;
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
  onSuccess: () => void;
}
export default function TransaksiBeliDialogForm({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [tanggal, setTanggal] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [totalKeseluruhan, setTotalKeseluruhan] = useState(0);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ongkir, setOngkir] = useState("");
  const [totalQty, setTotalQty] = useState(0);
  const [dibayar, setDibayar] = useState("");
  const [sisaHutang, setSisaHutang] = useState("");
  const [status, setStatus] = useState("Lunas");
  const [isOngkir, setIsOngkir] = useState("Tidak");
  const [kelolaSupplierOpen, setKelolaSupplierOpen] = useState(false);
  const [pilihBarangOpen, setPilihBarangOpen] = useState(false);
  const [details, setDetails] = useState<DetailBarang[]>([]);
  const [error, setError] = useState("");

  const [daftarBarang, setDaftarBarang] = useState<unknown[]>([]);
  const [cariBarang, setCariBarang] = useState("");
  const [selectedBarang, setSelectedBarang] = useState<unknown | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editDetailIndex, setEditDetailIndex] = useState<number | null>(null);
  const itemsPerPage = 5;

  // Tambahan state untuk confirm
  const [confirmType, setConfirmType] = useState<
    "simpan" | "batal" | "hapus" | null
  >(null);
  const [indexHapus, setIndexHapus] = useState<number | null>(null);

  const filteredBarang = daftarBarang.filter((b) =>
    b.nama_barang.toLowerCase().includes(cariBarang.toLowerCase())
  );
  const totalPages = Math.ceil(filteredBarang.length / itemsPerPage);
  const paginatedBarang = filteredBarang.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const userId = JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state
    ?.user?.id;

  // Fetch supplier & barang saat dialog dibuka
  useEffect(() => {
    if (open) {
      fetchSupplier();
      fetchBarang();
    }
  }, [open]);

  const fetchSupplier = async () => {
    const res = await axiosInstance.get("/supplier");
    setSuppliers(res.data.data || []);
  };

  const fetchBarang = async () => {
    const res = await axiosInstance.get("/barang");
    setDaftarBarang(res.data.data || []);
  };

  // Total dan sisa hutang dihitung ulang saat barang/status berubah
  useEffect(() => {
    const totalBarang = details.reduce((sum, d) => sum + d.subtotal, 0);
    const totalOngkir = isOngkir === "Ya" ? parseFloat(ongkir || "0") : 0;
    const totalKeseluruhan = totalBarang + totalOngkir;
    const totalQty = details.reduce((sum, item) => sum + item.qty, 0);
    setTotalQty(totalQty);

    setTotalKeseluruhan(totalKeseluruhan);

    if (status === "Lunas") {
      setDibayar(String(totalKeseluruhan));
      setSisaHutang("0");
    } else {
      const dibayarNum = parseFloat(dibayar || "0");
      setSisaHutang(String(totalKeseluruhan - dibayarNum));
    }
  }, [details, status, dibayar, ongkir, isOngkir]);

  const handleSubmit = async () => {
    const totalOngkir = isOngkir === "Ya" ? parseFloat(ongkir || "0") : 0;
    const totalQty = details.reduce((sum, d) => sum + d.qty, 0);

    const ongkirPerQty = totalQty > 0 ? totalOngkir / totalQty : 0;

    const finalDetail = details.map((d) => {
      const hargaFinal = d.harga_beli + ongkirPerQty;
      return {
        ...d,
        harga_beli: Math.round(hargaFinal),
        subtotal: Math.round(hargaFinal * d.qty),
      };
    });

    const totalFinal = finalDetail.reduce((sum, d) => sum + d.subtotal, 0);

    // Format tanggal ke "YYYY-MM-DD HH:mm:ss"
    // const tanggal = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const jamSekarang = now.toTimeString().split(" ")[0]; // contoh: "21:47:22"
    const tanggalLengkap = `${tanggal} ${jamSekarang}`;

    const payload = {
      tanggal: tanggalLengkap,
      supplier_id: Number(supplierId),
      total: totalFinal,
      ongkir: parseFloat(ongkir),
      dibayar: parseFloat(dibayar),
      sisa_hutang: status === "Lunas" ? 0 : parseFloat(sisaHutang),
      status,
      user_id: Number(userId),
      detail: finalDetail.map((d) => ({
        barang_id: Number(d.barang_id),
        satuan_id: Number(d.satuan_id),
        qty: d.qty,
        harga_beli: d.harga_beli,
        subtotal: d.subtotal,
      })),
    };

    try {
      const res = await axiosInstance.post("/transaksi-beli", payload);
      if (res.data?.status === "success") {
        onSuccess();
        resetForm();
        onOpenChange(false);
      } else {
        setError("Gagal menyimpan transaksi.");
      }
    } catch (err: unknown) {
      setError(err?.response?.data?.message || "Terjadi kesalahan.");
    }

    setTimeout(() => setError(""), 3000);
  };

  const resetForm = () => {
    setTanggal("");
    setSupplierId("");
    setOngkir("");
    setIsOngkir("Tidak");
    setDibayar("");
    setSisaHutang("");
    setStatus("Lunas");
    setDetails([]);
    setCariBarang("");
    setSelectedBarang(null);
    setEditDetailIndex(null);
    setTotalKeseluruhan(0);
  };
  // ====================== RENDER ======================
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="w-11/12"
          aria-describedby=""
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Pembelian</DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircleIcon className="w-5 h-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-[1fr_2fr] gap-10 ">
            {/* ===================== FORM ===================== */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="mb-1">Tanggal</Label>
                <Input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-1">Supplier</Label>
                <div className="flex gap-2">
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="border rounded px-2 py-1 w-full"
                    required
                  >
                    <option value="">Pilih supplier</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama_supplier}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setKelolaSupplierOpen(true)}
                  >
                    Kelola Supplier
                  </Button>
                </div>
              </div>
              <div>
                <Label>Masukkan Ongkos Kirim</Label>
                <RadioGroup
                  value={isOngkir}
                  onValueChange={setIsOngkir}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ya" id="lunas" />
                    <Label htmlFor="lunas">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Tidak" id="hutang" />
                    <Label htmlFor="hutang">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>
              <div style={{ display: isOngkir === "Ya" ? "block" : "none" }}>
                <Label className="mb-1">Biaya Ongkir</Label>
                <Input
                  type="number"
                  value={ongkir}
                  onChange={(e) => setOngkir(e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <RadioGroup
                  value={status}
                  onValueChange={setStatus}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Lunas" id="lunas" />
                    <Label htmlFor="lunas">Lunas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hutang" id="hutang" />
                    <Label htmlFor="hutang">Hutang</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-1">Dibayar</Label>
                <Input
                  type="number"
                  value={dibayar}
                  onChange={(e) => setDibayar(e.target.value)}
                  disabled={status === "Lunas"}
                />
              </div>
              <div style={{ display: status === "Hutang" ? "block" : "none" }}>
                {/* <Label className="mb-1">Sisa Hutang</Label>
                <Input type="number" value={sisaHutang} disabled /> */}
                <div className="mb-1">
                  <p className="text-[1.2rem] text-gray-700 mt-2">
                    <b>Sisa Hutang:</b> {rupiahFormat(sisaHutang)}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                disabled={
                  details.length === 0 || !supplierId || tanggal.trim() === ""
                }
                onClick={() => setConfirmType("simpan")}
              >
                Simpan Transaksi
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmType("batal")}
              >
                Batal
              </Button>
            </div>

            {/* ===================== TABEL DETAIL BARANG ===================== */}
            <div className="mb-3 pl-6 border-l border-muted">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">
                  List Barang yang Dibeli
                </h3>
              </div>

              {details.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Belum ada barang dipilih
                </p>
              ) : (
                <>
                  <div className="space-y-2 max-h-50 overflow-y-auto pr-2">
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-2 py-1">Nama</th>
                          <th className="border px-2 py-1">Satuan</th>
                          <th className="border px-2 py-1">Qty</th>
                          <th className="border px-2 py-1">Harga Beli</th>
                          <th className="border px-2 py-1">Subtotal</th>
                          <th className="border px-2 py-1">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((item, idx) => (
                          <tr key={idx}>
                            <td className="border px-2 py-1">
                              {item.nama_barang}
                            </td>
                            <td className="border px-2 py-1">
                              {item.nama_satuan}
                            </td>
                            <td className="border px-2 py-1">{item.qty}</td>
                            <td className="border px-2 py-1">
                              {rupiahFormat(
                                isOngkir === "Ya"
                                  ? item.harga_beli + (ongkir / totalQty || 0)
                                  : item.harga_beli
                              )}
                            </td>
                            <td className="border px-2 py-1">
                              {rupiahFormat(
                                isOngkir === "Ya"
                                  ? (item.harga_beli +
                                      (ongkir / totalQty || 0)) *
                                      item.qty
                                  : item.harga_beli * item.qty
                              )}
                            </td>
                            <td className="border px-2 py-1">
                              <div className="flex justify-center items-center gap-x-2 sm:gap-x-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedBarang({
                                      id: item.barang_id,
                                      nama_barang: item.nama_barang,
                                      kode_barang: "", // jika tersedia
                                      nama_kategori: "", // jika tersedia
                                    });
                                    setEditDetailIndex(idx);
                                    setPilihBarangOpen(true);
                                  }}
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => {
                                    setIndexHapus(idx);
                                    setConfirmType("hapus");
                                  }}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mb-1">
                    <p className="text-[1.3rem] text-gray-700 mt-2">
                      <b>Total:</b> {rupiahFormat(totalKeseluruhan)}
                    </p>
                  </div>
                </>
              )}
              {/* ===================== TABEL BARANG ===================== */}
              <Separator className="my-4" />
              {/* ===================== TABEL BARANG UNTUK DIPILIH ===================== */}
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Daftar Barang</h3>

                <Input
                  placeholder="Cari barang..."
                  value={cariBarang}
                  onChange={(e) => {
                    setCariBarang(e.target.value);
                    setCurrentPage(1); // reset ke halaman 1 saat search berubah
                  }}
                  className="mb-3 max-w-sm"
                />

                <div className="overflow-x-auto space-y-2 max-h-40 overflow-y-auto pr-2">
                  <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1 text-left">Nama</th>
                        <th className="border px-2 py-1 text-left">Kategori</th>
                        <th className="border px-2 py-1 text-left">Kode</th>
                        <th className="border px-2 py-1 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBarang.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-4 text-gray-500"
                          >
                            Tidak ada barang ditemukan
                          </td>
                        </tr>
                      ) : (
                        paginatedBarang.map((barang) => (
                          <tr key={barang.id}>
                            <td className="border px-2 py-1">
                              {barang.nama_barang}
                            </td>
                            <td className="border px-2 py-1">
                              {barang.nama_kategori}
                            </td>
                            <td className="border px-2 py-1">
                              {barang.kode_barang}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setEditDetailIndex(null);
                                  setSelectedBarang(barang);
                                  setPilihBarangOpen(true);
                                }}
                              >
                                Tambah Barang
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-between items-center mt-3 text-sm text-muted-foreground">
                  <div>
                    Menampilkan {paginatedBarang.length} dari{" "}
                    {filteredBarang.length} barang
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </Button>
                    <span>
                      Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============== SUB DIALOG ============== */}
      <KelolaSupplierDialog
        open={kelolaSupplierOpen}
        onOpenChange={(newOpen) => {
          setKelolaSupplierOpen(newOpen);
          if (!newOpen) {
            fetchSupplier();
          }
        }}
      />
      <PilihBarangDialogForm
        open={pilihBarangOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditDetailIndex(null); // reset saat ditutup
            setSelectedBarang(null);
          }
          setPilihBarangOpen(open);
        }}
        barang={selectedBarang} // disini adalah data barang yang akan diteruskan sesuai dengan barang yang dipilih oleh user
        initialData={editDetailIndex !== null ? details[editDetailIndex] : null}
        onAdd={(newDetail) => {
          if (editDetailIndex !== null) {
            setDetails((prev) =>
              prev.map((d, i) => (i === editDetailIndex ? newDetail : d))
            );
            setEditDetailIndex(null);
          } else {
            setDetails((prev) => [...prev, newDetail]);
          }
        }}
      />
      <ConfirmDialog
        open={!!confirmType}
        title={
          confirmType === "simpan"
            ? "Simpan Transaksi Beli"
            : confirmType === "batal"
            ? "Batalkan Input Transaksi?"
            : "Hapus Barang dariTransaksi"
        }
        message={
          confirmType === "simpan"
            ? "Yakin simpan Transaksi Beli?"
            : confirmType === "batal"
            ? "Yakin kembali? Semua input akan direset."
            : "Yakin ingin menghapus barang ini?"
        }
        onCancel={() => {
          setConfirmType(null);
          setIndexHapus(null);
        }}
        onConfirm={() => {
          if (confirmType === "simpan") {
            handleSubmit();
          } else if (confirmType === "batal") {
            resetForm();
            onOpenChange(false);
          } else if (confirmType === "hapus" && indexHapus !== null) {
            setDetails((prev) => prev.filter((_, i) => i !== indexHapus));
          }

          setConfirmType(null);
          setIndexHapus(null);
        }}
      />
    </>
  );
}
