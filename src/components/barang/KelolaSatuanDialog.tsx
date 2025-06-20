import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  RefreshCcw,
} from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import SatuanDialogForm from "./SatuanDialogForm";
import { rupiahFormat } from "@/utils/formatting";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangId: string;
}

interface Satuan {
  id: string;
  nama_satuan: string;
  harga_jual: string;
  harga_beli: string;
  konversi_ke_satuan_dasar: number;
  is_satuan_default: number;
}

interface BarangInfo {
  nama_barang: string;
  kode_barang: string;
}

export default function KelolaSatuanDialog({
  open,
  onOpenChange,
  barangId,
}: Props) {
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [satuanFormOpen, setSatuanFormOpen] = useState(false);
  const [selectedSatuan, setSelectedSatuan] = useState<Satuan | null>(null);
  const [barangInfo, setBarangInfo] = useState<BarangInfo | null>(null);

  // setup default satuan/convert to default satuan
  // const satuanDefault = satuanList.find((s) => s.is_satuan_default);

  // State untuk delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const fetchSatuan = useCallback(async () => {
    try {
      console.log("barangId:", barangId);
      const res = await axiosInstance.get(`/satuan-barang/barang/${barangId}`);
      setSatuanList(res.data.data || []);
      console.log("satuan:", res.data.data);
    } catch {
      setError("Gagal memuat data satuan.".err);
    }
  }, [barangId]);

  const fetchBarangInfo = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/barang/${barangId}`);
      setBarangInfo(res.data?.data);
    } catch {
      setBarangInfo(null);
    }
  }, [barangId]);

  useEffect(() => {
    if (open) {
      fetchSatuan();
      fetchBarangInfo();
    }
  }, [open, barangId, fetchSatuan, fetchBarangInfo]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kelola Satuan Barang</DialogTitle>
            <DialogDescription>
              Daftar satuan untuk barang ini.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Tampilkan info barang */}
          {barangInfo && (
            <div className="mb-4 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Nama Barang:</span>{" "}
                {barangInfo.nama_barang}
              </p>
              <p>
                <span className="font-semibold">Kode Barang:</span>{" "}
                {barangInfo.kode_barang}
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Alert sukses */}
          {successMessage && (
            <Alert
              variant="default"
              className="mb-4 border-green-500 bg-green-50"
            >
              <AlertCircleIcon className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-700">Berhasil</AlertTitle>
              <AlertDescription className="text-green-600">
                Data Satuan Berhasil Dihapus.
              </AlertDescription>
            </Alert>
          )}

          {/* ✅ Tombol tambah */}
          <div className="flex justify-end mb-3 gap-2">
            <Button
              onClick={() => {
                fetchSatuan();
              }}
              size="sm"
            >
              <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button
              onClick={() => {
                setSelectedSatuan(null);
                setSatuanFormOpen(true);
              }}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Tambah Satuan
            </Button>
          </div>

          {/* ✅ Tabel satuan */}
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Satuan</th>
                  <th className="border px-2 py-1">Harga Jual</th>
                  <th className="border px-2 py-1">Harga Beli</th>
                  <th className="border px-2 py-1">Konversi</th>
                  <th className="border px-2 py-1">Default</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
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
                      <td className="border px-2 py-1">{satuan.nama_satuan}</td>
                      <td className="border px-2 py-1">
                        {rupiahFormat(satuan.harga_jual)}
                      </td>
                      <td className="border px-2 py-1">
                        {rupiahFormat(satuan.harga_beli)}
                      </td>

                      {/* ✅ Konversi dinamis */}
                      <td className="border px-2 py-1">{konversiText}</td>

                      {/* ✅ Default ditentukan oleh angka 1/0 */}
                      {/* {console.log(satuan)} */}
                      <td className="border px-2 py-1 text-center">
                        {Number(satuan.is_satuan_default) === 1 ? "✅" : "-"}
                      </td>

                      <td className="border px-2 py-1 text-center">
                        <div className="flex justify-center items-center gap-x-2 sm:gap-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedSatuan(satuan);
                              setSatuanFormOpen(true);
                            }}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setSelectedDeleteId(satuan.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Tutup
            </Button>
          </DialogFooter>

          {/* ✅ Form Tambah/Edit */}
          <SatuanDialogForm
            open={satuanFormOpen}
            onOpenChange={(open) => {
              setSatuanFormOpen(open);
              if (!open) setSelectedSatuan(null);
            }}
            barangId={barangId}
            initialData={selectedSatuan}
            onSuccess={() => fetchSatuan()}
          />
        </DialogContent>
      </Dialog>
      {/* Dialog hapus */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (!selectedDeleteId) return;
          try {
            const res = await axiosInstance.delete(
              `/satuan-barang/${selectedDeleteId}`
            );
            if (res.data?.status === "success") {
              setSuccessMessage(res.data.message || "Barang dihapus");
              fetchSatuan();
            }
          } catch (err: unknown) {
            const msg =
              err?.response?.data?.message || "Gagal menghapus barang.";
            setError(msg);
          } finally {
            setDeleteDialogOpen(false);
            setSelectedDeleteId(null);
          }
          setTimeout(() => setSuccessMessage(""), 3000);
          setTimeout(() => setError(""), 3000);
        }}
      />
    </>
  );
}
