// src/components/supplier/KelolaSupplierDialog.tsx

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";

import SupplierDialogForm from "./SupplierDialogForm";
import DeleteConfirmDialog from "../barang/DeleteConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Supplier {
  id: string;
  nama_supplier: string;
  alamat: string;
  telepon: string;
}

export default function KelolaSupplierDialog({ open, onOpenChange }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [error, setError] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [formOpen, setFormOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // =====================
  // Fetch supplier
  // =====================
  const fetchSuppliers = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/supplier");
      setSuppliers(res.data.data || []);
    } catch (err: unknown) {
      setError(`Gagal memuat data supplier: ${err}.`);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchSuppliers();
    }
  }, [open, fetchSuppliers]);

  // =====================
  // Hapus Supplier
  // =====================
  const handleDelete = async () => {
    if (!selectedDeleteId) return;
    try {
      await axiosInstance.delete(`/supplier/${selectedDeleteId}`);
      fetchSuppliers();
    } catch (err: unknown) {
      const msg = err?.response?.data?.message || "Gagal menghapus supplier.";
      setError(msg);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Kelola Supplier</DialogTitle>
            <DialogDescription>
              Tambah, ubah, atau hapus data supplier.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircleIcon className="h-5 w-5" />
              <AlertTitle>Gagal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Tombol tambah */}
          <div className="flex justify-end mb-3">
            <Button
              onClick={() => {
                setSelectedSupplier(null);
                setFormOpen(true);
              }}
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" /> Tambah Supplier
            </Button>
          </div>

          {/* Tabel Supplier */}
          <div className="overflow-x-auto text-sm">
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1 text-left">Nama</th>
                  <th className="border px-2 py-1 text-left">Alamat</th>
                  <th className="border px-2 py-1 text-left">Telepon</th>
                  <th className="border px-2 py-1 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-3 text-gray-500">
                      Tidak ada data supplier.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td className="border px-2 py-1">
                        {supplier.nama_supplier}
                      </td>
                      <td className="border px-2 py-1">{supplier.alamat}</td>
                      <td className="border px-2 py-1">{supplier.telepon}</td>
                      <td className="border px-2 py-1 text-center space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setFormOpen(true);
                          }}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="link"
                          onClick={() => {
                            setSelectedDeleteId(supplier.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>

          {/* Form Tambah/Edit */}
          <SupplierDialogForm
            open={formOpen}
            onOpenChange={setFormOpen}
            initialData={selectedSupplier}
            onSuccess={() => {
              fetchSuppliers();
              setFormOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Hapus */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
