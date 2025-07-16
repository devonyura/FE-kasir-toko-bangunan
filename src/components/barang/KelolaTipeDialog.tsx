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
import TipeDialogForm from "./TipeDialogForm";
import { rupiahFormat } from "@/utils/formatting";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import LabelBarcodePreviewDialog1 from "./LabelBarcodePreviewDialog1";
import { CopyButton } from "@/components/common/CopyButton"

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barangId: string;
}

interface tipe {
  id: string;
  nama_tipe: string;
  harga_beli: string;
  harga_jual: string;
  selisih: string;
  kode_barang_tipe: string;
  stok: number;
}

interface BarangInfo {
  nama_barang: string;
  kode_barang: string;
  nama_kategori: string;
}

interface InfoBarcode {
  nama_barang: string | undefined;
  kode_barang_tipe: string;
  nama_tipe: string;
  harga_jual: string;
}

export default function KelolatipeDialog({
  open,
  onOpenChange,
  barangId,
}: Props) {
  const [tipeList, setTipeList] = useState<tipe[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [alertMinTipe, setAlertMinTipe] = useState("");
  const [tipeFormOpen, settipeFormOpen] = useState(false);
  const [selectedtipe, setSelectedtipe] = useState<tipe | null>(null);
  const [barangInfo, setBarangInfo] = useState<BarangInfo | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const [openPreview, setOpenPreview] = useState(false);
  const [barcodeData, setBarcodeData] = useState<InfoBarcode | null>(null);

  const fetchtipe = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/tipe-barang/barang/${barangId}`);
      setTipeList(res.data.data || []);
    } catch {
      setError(`Gagal memuat data tipe:`);
    }
    setTimeout(() => setError(""), 1200);
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
      fetchtipe();
      fetchBarangInfo();
    }

    if (alertMinTipe) {
      setTimeout(() => setAlertMinTipe(""), 2300)
    }
  }, [open, fetchtipe, fetchBarangInfo, alertMinTipe]);

  const handlePrintBarcode = (kode_barang_tipe: string, nama_tipe: string, harga_jual: string) => {
    setBarcodeData({
      nama_barang: barangInfo?.nama_barang,
      kode_barang_tipe: kode_barang_tipe,
      nama_tipe: nama_tipe,
      harga_jual: harga_jual,
    });
    setOpenPreview(true);
  };

  // ✅ Kontrol menutup dialog
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (tipeList.length === 0) {
        setAlertMinTipe("1 barang minimal harus ada 1 tipe!");
        return; // blokir
      }
      onOpenChange(false); // boleh tutup
    } else {
      onOpenChange(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Kelola tipe Barang</DialogTitle>
            <DialogDescription>Daftar tipe untuk barang ini.</DialogDescription>
          </DialogHeader>

          {/* Info barang */}
          {barangInfo && (
            <div className="mb-4 text-xl text-gray-600">
              <p>
                <span>Nama Barang:</span>{" "}
                <span className="font-semibold">{barangInfo.nama_barang}</span>
              </p>
              <p>
                <span>Kategori:</span>{" "}
                <span className="font-semibold">{barangInfo.nama_kategori}</span>
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

          {alertMinTipe && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Info</AlertTitle>
              <AlertDescription>{alertMinTipe}</AlertDescription>
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
                Data tipe Berhasil Dihapus.
              </AlertDescription>
            </Alert>
          )}

          {/* Tombol tambah */}
          <div className="flex justify-end mb-3 gap-2">
            <Button onClick={fetchtipe} size="sm">
              <RefreshCcw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button
              onClick={() => {
                setSelectedtipe(null);
                settipeFormOpen(true);
              }}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Tambah tipe
            </Button>
          </div>

          <ScrollArea className="max-h-[300px] border rounded">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Tipe</th>
                  <th className="border px-2 py-1">Kode Barang</th>
                  <th className="border px-2 py-1">Harga Beli</th>
                  <th className="border px-2 py-1">Harga Jual</th>
                  <th className="border px-2 py-1">Selisih</th>
                  <th className="border px-2 py-1">Stok</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tipeList.map((tipe) => (
                  <tr key={tipe.id}>
                    <td className="border px-2 py-1">{tipe.nama_tipe}<CopyButton teks={tipe.nama_tipe} /></td>
                    <td className="border px-2 py-1">
                      {tipe.kode_barang_tipe}
                      <CopyButton teks={tipe.kode_barang_tipe} />
                    </td>
                    <td className="border px-2 py-1">
                      {rupiahFormat(tipe.harga_beli)}
                    </td>
                    <td className="border px-2 py-1">
                      {rupiahFormat(tipe.harga_jual)}
                    </td>
                    <td className="border px-2 py-1 font-medium text-green-600">
                      {rupiahFormat(tipe.selisih)}
                    </td>
                    <td className="border px-2 py-1">
                      {tipe.stok}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex justify-center items-center gap-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedtipe(tipe);
                            settipeFormOpen(true);
                          }}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setSelectedDeleteId(tipe.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handlePrintBarcode(
                              tipe.kode_barang_tipe,
                              tipe.nama_tipe,
                              tipe.harga_jual
                            )
                          }
                        >
                          Print Label
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => handleOpenChange(false)} variant="outline">
              Tutup
            </Button>
          </DialogFooter>

          <TipeDialogForm
            open={tipeFormOpen}
            onOpenChange={(open) => {
              settipeFormOpen(open);
              if (!open) setSelectedtipe(null);
            }}
            barangId={barangId}
            initialData={selectedtipe}
            onSuccess={() => fetchtipe()}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (!selectedDeleteId) return;
          try {
            const res = await axiosInstance.delete(
              `/tipe-barang/${selectedDeleteId}`
            );
            if (res.data?.status === "success") {
              setSuccessMessage(res.data.message || "Barang dihapus");
              fetchtipe();
            }
          } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              const msg =
                err?.response?.data?.message || "Gagal menghapus barang.";
              setError(msg);
            }
          } finally {
            setDeleteDialogOpen(false);
            setSelectedDeleteId(null);
          }
          setTimeout(() => setSuccessMessage(""), 3000);
        }}
      />

      {barcodeData && (
        <LabelBarcodePreviewDialog1
          open={openPreview}
          onOpenChange={setOpenPreview}
          barang={barcodeData}
        />
      )}
    </>
  );
}
