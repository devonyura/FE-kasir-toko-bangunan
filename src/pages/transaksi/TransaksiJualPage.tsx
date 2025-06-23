// src/pages/transaksi/TransaksiJualPage.tsx

import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { columns } from "@/components/transaksi-jual/Columns";
import { DataTable } from "@/components/transaksi-jual/DataTable";
import PelunasanTransaksiDialogForm from "@/components/transaksi-jual/PelunasanTransaksiDialogForm";
import type { TransaksiJual } from "@/types/transaksi";

export default function TransaksiJualPage() {
  const [data, setData] = useState<TransaksiJual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // pelunasan
  const [selectedTransaksi, setSelectedTransaksi] =
    useState<TransaksiJual | null>(null);
  const [pelunasanDialogOpen, setPelunasanDialogOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/transaksi-jual", {
        params: { page, perPage },
      });
      setData(res.data?.data || []);
      setTotalPages(res.data?.pagination?.totalPages || 1);
    } catch (err: unknown) {
      setError(`Gagal memuat data transaksi: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  const handleSuccess = (message: string) => {
    console.log(message);
    setSuccessMessage(message);
    fetchData();
    setPelunasanDialogOpen(false);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);

  const handlePelunasan = (trx: TransaksiJual) => {
    setSelectedTransaksi(trx);
    setPelunasanDialogOpen(true);
  };

  const handlePrint = (trx: TransaksiJual) => {
    window.open(`/nota/transaksi-jual/${trx.id}`, "_blank");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Transaksi Penjualan</h1>
        <p className="text-sm text-muted-foreground">
          Daftar transaksi hasil dari POS dan status piutang pelanggan.
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

      <Input
        placeholder="Cari nama customer..."
        className="max-w-sm"
        disabled
      />

      {loading ? (
        <Button disabled>
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Loading...
        </Button>
      ) : (
        <>
          <DataTable
            columns={columns(handlePelunasan, handlePrint)}
            data={data}
          />

          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Sebelumnya
              </Button>
              <span className="text-sm">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Berikutnya
              </Button>
            </div>
          )}
        </>
      )}

      <PelunasanTransaksiDialogForm
        open={pelunasanDialogOpen}
        onOpenChange={setPelunasanDialogOpen}
        transaksi={selectedTransaksi}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
