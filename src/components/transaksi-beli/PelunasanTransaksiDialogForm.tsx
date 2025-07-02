// File: src/components/transaksi-beli/PelunasanTransaksiDialogForm.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { axiosInstance } from "@/utils/axios";
import { format } from "date-fns";
// import { id } from "date-fns/locale";
import { rupiahFormat } from "../../utils/formatting";
import ConfirmDialog from "../common/ConfirmDialog";
import axios from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaksi: {
    id: string;
    tanggal: string;
    nama_supplier: string;
    total: string;
    dibayar: string;
    sisa_hutang: string;
    status: string;
  } | null;
  onSuccess: (msg: string) => void;
}

export default function PelunasanTransaksiDialogForm({
  open,
  onOpenChange,
  transaksi,
  onSuccess,
}: Props) {
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [error, setError] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      const sisa = parseFloat(transaksi?.sisa_hutang || "0");
      setJumlahBayar(sisa > 0 ? Math.round(sisa).toString() : "");
      setError("");
    }
  }, [open, transaksi]);

  const handleSubmit = async () => {
    try {
      const payload = {
        dibayar: parseFloat(jumlahBayar),
      };
      const res = await axiosInstance.put(
        `/transaksi-beli/lunas/${transaksi?.id}`,
        payload
      );

      if (res.data?.status === "success") {
        onSuccess("sukses");
        onOpenChange(false);
      } else {
        setError("Gagal memproses pelunasan.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err?.response?.data?.message || "Terjadi kesalahan saat melunasi.";
        setError(msg);
      }
    }
    setOpenConfirm(false);
  };

  if (!transaksi) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Pelunasan Hutang</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          <div>
            <Label className="mb-2">Supplier</Label>
            <Input value={transaksi.nama_supplier} disabled />
          </div>
          <div>
            <Label className="mb-2">Tanggal Transaksi</Label>
            <Input
              value={format(new Date(transaksi.tanggal), "dd-MM-yyyy")}
              disabled
            />
          </div>
          <div>
            <Label className="mb-2">Total</Label>
            <Input value={rupiahFormat(Number(transaksi.total))} disabled />
          </div>
          <div>
            <Label className="mb-2">Sudah Dibayar</Label>
            <Input value={rupiahFormat(Number(transaksi.dibayar))} disabled />
          </div>
          <div>
            <Label className="mb-2">Sisa Hutang</Label>
            <Input
              value={rupiahFormat(Number(transaksi.sisa_hutang))}
              disabled
            />
          </div>
          <div>
            <Label className="mb-2">Jumlah Pembayaran</Label>
            <Input
              type="number"
              value={jumlahBayar}
              onChange={(e) => setJumlahBayar(e.target.value)}
              max={parseFloat(transaksi.sisa_hutang)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            Lunasi Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
      <ConfirmDialog
        open={openConfirm}
        title="Simpan Pelunasan"
        message="Yakin simpan pelunasan ini?"
        onCancel={() => {
          setOpenConfirm(false);
        }}
        onConfirm={handleSubmit}
      />
    </Dialog>
  );
}
