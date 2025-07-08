import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import { columns } from "@/components/retur/Columns";
import { DataTable } from "@/components/retur/DataTable";
import ReturDialogForm from "@/components/retur/ReturDialogForm";

export default function ReturPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/retur", {
        params: { page, perPage },
      });
      setData(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err: unknown) {
      setError(`Gagal memuat data retur. ${err}`);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = (msg: string) => {
    setFormOpen(false);
    setSuccessMessage(msg);
    fetchData();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Data Retur Barang</h1>
        <p className="text-muted-foreground text-sm">
          Daftar retur transaksi penjualan atau pembelian barang.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-5 w-5" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert variant="default" className="border-green-500 bg-green-50">
          <AlertCircleIcon className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-700">Berhasil</AlertTitle>
          <AlertDescription className="text-green-600">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <Button onClick={() => setFormOpen(true)}>Tambah Retur</Button>
      </div>

      {loading ? (
        <Button disabled>
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Loading...
        </Button>
      ) : (
        <div className="w-[90vw]">
          <DataTable columns={columns} data={data} />
          {totalPages > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Sebelumnya
              </Button>
              <span className="text-sm">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Berikutnya
              </Button>
            </div>
          )}
        </div>
      )}

      <ReturDialogForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
