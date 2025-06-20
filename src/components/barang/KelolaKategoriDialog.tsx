// src/components/barang/KelolaKategoriDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import KategoriDialogForm from "./KategoriDialogForm";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKategoriChange?: () => void; // Optional, untuk refresh select
}

interface Kategori {
  id: string;
  nama_kategori: string;
}

export default function KelolaKategoriDialog({
  open,
  onOpenChange,
  onKategoriChange,
}: Props) {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [error, setError] = useState("");
  const [selectedData, setSelectedData] = useState<Kategori | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchKategori = async () => {
    try {
      const res = await axiosInstance.get("/kategori");
      setKategoriList(res.data.data || []);
    } catch {
      setError("Gagal memuat data kategori.");
    }
  };

  useEffect(() => {
    if (open) fetchKategori();
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kelola Kategori</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4">
            <Button
              onClick={() => {
                setSelectedData(null);
                setDialogOpen(true);
              }}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Tambah Kategori
            </Button>
          </div>

          <ul className="space-y-2 max-h-50 overflow-y-auto pr-2">
            {kategoriList.map((kat) => (
              <li key={kat.id} className="flex justify-between items-center">
                <span>{kat.nama_kategori}</span>
                <div className="space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setSelectedData(kat);
                      setDialogOpen(true);
                    }}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                      setDeleteId(kat.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
          </DialogFooter>

          <KategoriDialogForm
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            initialData={selectedData}
            onSuccess={() => {
              fetchKategori();
              onKategoriChange?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await axiosInstance.delete(`/kategori/${deleteId}`);
            fetchKategori();
            onKategoriChange?.();
          } catch {
            setError("Gagal menghapus kategori.");
          } finally {
            setDeleteId(null);
            setDeleteDialogOpen(false);
          }
        }}
      />
    </>
  );
}
