// Halaman utama manajemen data barang

import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

import BarangDialogForm from "@/components/barang/BarangDialogForm";
import DeleteConfirmDialog from "@/components/barang/DeleteConfirmDialog";

// Tipe data barang
type Barang = {
  id: string;
  nama_barang: string;
  kategori_id: string;
  kode_barang: string;
  keterangan: string;
};

export default function BarangPage() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State untuk tambah/edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Barang | null>(null);

  // State untuk delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // Fetch data barang dari backend
  const fetchBarang = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/barang");
      setBarangs(res.data.data);
    } catch {
      setError("Gagal memuat data barang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  // Handler sukses create/edit
  const handleSuccess = (message: string) => {
    setDialogOpen(false);
    setSuccessMessage(message);
    fetchBarang();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="p-4">
      {/* Header dan tombol tambah */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Data Barang</h1>
        <Button
          onClick={() => {
            setEditData(null);
            setDialogOpen(true);
          }}
        >
          Tambah Barang
        </Button>
      </div>

      {/* Alert error */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-5 w-5" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Alert sukses */}
      {successMessage && (
        <Alert variant="default" className="mb-4 border-green-500 bg-green-50">
          <AlertCircleIcon className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700">Berhasil</AlertTitle>
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabel data */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Nama</th>
                <th className="border px-4 py-2 text-left">Kategori</th>
                <th className="border px-4 py-2 text-left">Kode</th>
                <th className="border px-4 py-2 text-left">Keterangan</th>
                <th className="border px-4 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barangs.map((barang) => (
                <tr key={barang.id}>
                  <td className="border px-4 py-2">{barang.nama_barang}</td>
                  <td className="border px-4 py-2">{barang.kategori_id}</td>
                  <td className="border px-4 py-2">{barang.kode_barang}</td>
                  <td className="border px-4 py-2">{barang.keterangan}</td>
                  <td className="border px-4 py-2 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="mr-2"
                      onClick={() => {
                        setEditData(barang);
                        setDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => {
                        setSelectedDeleteId(barang.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
              {barangs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Tidak ada data barang.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog tambah/edit */}
      <BarangDialogForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editData}
        onSuccess={handleSuccess}
      />

      {/* Dialog hapus */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (!selectedDeleteId) return;
          try {
            const res = await axiosInstance.delete(
              `/barang/${selectedDeleteId}`
            );
            if (res.data?.status === "success") {
              setSuccessMessage(res.data.message || "Barang dihapus");
              fetchBarang();
              setTimeout(() => setSuccessMessage(""), 3000);
            }
          } catch (err: unknown) {
            const msg =
              err?.response?.data?.message || "Gagal menghapus barang.";
            setError(msg);
          } finally {
            setDeleteDialogOpen(false);
            setSelectedDeleteId(null);
          }
        }}
      />
    </div>
  );
}
