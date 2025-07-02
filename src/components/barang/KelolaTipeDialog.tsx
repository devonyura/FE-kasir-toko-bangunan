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
}

interface BarangInfo {
  nama_barang: string;
  kode_barang: string;
}

export default function KelolatipeDialog({
  open,
  onOpenChange,
  barangId,
}: Props) {
  const [tipeList, setTipeList] = useState<tipe[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tipeFormOpen, settipeFormOpen] = useState(false);
  const [selectedtipe, setSelectedtipe] = useState<tipe | null>(null);
  const [barangInfo, setBarangInfo] = useState<BarangInfo | null>(null);

  // setup default tipe/convert to default tipe
  // const tipeDefault = tipeList.find((s) => s.is_tipe_default);

  // State untuk delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const fetchtipe = useCallback(async () => {
    try {
      console.log("barangId:", barangId);
      const res = await axiosInstance.get(`/tipe-barang/barang/${barangId}`);
      setTipeList(res.data.data || []);
      console.log("tipe:", res.data.data);
    } catch {
      setError(`Gagal memuat data tipe:`);
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
      fetchtipe();
      fetchBarangInfo();
    }
  }, [open, barangId, fetchtipe, fetchBarangInfo]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kelola tipe Barang</DialogTitle>
            <DialogDescription>Daftar tipe untuk barang ini.</DialogDescription>
          </DialogHeader>

          {/* ✅ Tampilkan info barang */}
          {barangInfo && (
            <div className="mb-4 text-xl text-gray-600">
              <p>
                <span>Nama Barang:</span>{" "}
                <span className="font-semibold">{barangInfo.nama_barang}</span>
              </p>
              <p>
                <span>Kode Barang:</span>{" "}
                <span className="font-semibold">{barangInfo.kode_barang}</span>
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
                Data tipe Berhasil Dihapus.
              </AlertDescription>
            </Alert>
          )}

          {/* ✅ Tombol tambah */}
          <div className="flex justify-end mb-3 gap-2">
            <Button
              onClick={() => {
                fetchtipe();
              }}
              size="sm"
            >
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

          {/* ✅ Tabel tipe */}
          <ScrollArea className="max-h-[300px] border rounded">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">tipe</th>
                  <th className="border px-2 py-1">Harga Beli (modal)</th>
                  <th className="border px-2 py-1">Harga Jual</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tipeList.map((tipe) => {
                  return (
                    <tr key={tipe.id}>
                      <td className="border px-2 py-1">{tipe.nama_tipe}</td>
                      <td className="border px-2 py-1">
                        {rupiahFormat(tipe.harga_beli)}
                      </td>
                      <td className="border px-2 py-1">
                        {rupiahFormat(tipe.harga_jual)}
                      </td>

                      <td className="border px-2 py-1 text-center">
                        <div className="flex justify-center items-center gap-x-2 sm:gap-x-1">
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ScrollArea>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Tutup
            </Button>
          </DialogFooter>

          {/* ✅ Form Tambah/Edit */}
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
      {/* Dialog hapus */}
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
          setTimeout(() => setError(""), 3000);
        }}
      />
    </>
  );
}
