// src/pages/transaksi/TransaksiBeliPage.tsx
import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/utils/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import type { TransaksiBeli } from "@/components/transaksi-beli/types";
import { columns } from "@/components/transaksi-beli/Columns";
import { DataTable } from "@/components/transaksi-beli/DataTable";
import TransaksiBeliDialogForm from "@/components/transaksi-beli/TransaksiBeliDialogForm";
import PelunasanTransaksiDialogForm from "@/components/transaksi-beli/PelunasanTransaksiDialogForm";

export default function TransaksiBeliPage() {
  const [data, setData] = useState<TransaksiBeli[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  // untuk paaaginatioon!
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // pelunsanhutang
  const [selectedTransaksi, setSelectedTransaksi] =
    useState<TransaksiBeli | null>(null);
  const [pelunasanDialogOpen, setPelunasanDialogOpen] = useState(false);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axiosInstance.get("/transaksi-beli");
  //     setData(res.data?.data || []);
  //   } catch (err: unknown) {
  //     setError(`Gagal memuat data transaksi: ${err}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/transaksi-beli", {
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
    setFormOpen(false);
    setSuccessMessage(message);
    fetchData();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  useEffect(() => {
    fetchData();
  }, [page, fetchData]);
  const handlePelunasan = (transaksi: TransaksiBeli) => {
    setSelectedTransaksi(transaksi);
    setPelunasanDialogOpen(true);
  };

  const handlePrint = (transaksi: TransaksiBeli) => {
    // misalnya buka tab baru dengan URL cetak
    window.open(`/nota/transaksi-beli/${transaksi.id}`, "_blank");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Kelola Transaksi Pembelian</h1>
        <p className="text-muted-foreground text-sm">
          Mencatat transaksi pembelian barang dan hutang ke supplier.
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
        <Input
          placeholder="Cari nama supplier..."
          value=""
          onChange={() => {}}
          className="max-w-sm"
        />
        <Button onClick={() => setFormOpen(true)}>Tambah Transaksi</Button>
      </div>

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

      <TransaksiBeliDialogForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleSuccess}
      />

      <PelunasanTransaksiDialogForm
        open={pelunasanDialogOpen}
        onOpenChange={setPelunasanDialogOpen}
        transaksi={selectedTransaksi}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          fetchData();
          setPelunasanDialogOpen(false);
        }}
      />
    </div>
  );
}
