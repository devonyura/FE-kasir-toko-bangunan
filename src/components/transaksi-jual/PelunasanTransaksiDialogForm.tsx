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
import { rupiahFormat } from "@/utils/formatting";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaksi: {
    id: string;
    tanggal: string;
    customer: string;
    total: string;
    dibayar: string;
    sisa_piutang: string;
    status: string;
  } | null;
  onSuccess: () => void;
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
    if (open && transaksi) {
      setJumlahBayar(transaksi.sisa_piutang || "");
      setError("");
    }
  }, [open, transaksi]);

  const handleSubmit = async () => {
    try {
      const payload = {
        dibayar: parseFloat(jumlahBayar),
      };

      const res = await axiosInstance.put(
        `/transaksi-jual/lunas/${transaksi?.id}`,
        payload
      );

      if (res.data?.status === "success") {
        // console.log(res.data.message);
        onSuccess(res.data.message);
        onOpenChange(false);
      } else {
        setError("Gagal memproses pelunasan.");
      }
    } catch (err: unknown) {
      const msg =
        err?.response?.data?.message || "Terjadi kesalahan saat melunasi.";
      setError(msg);
    }
    setOpenConfirm(false);
  };

  if (!transaksi) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Pelunasan Piutang</DialogTitle>
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
            <Label>Customer</Label>
            <Input value={transaksi.customer} disabled />
          </div>
          <div>
            <Label>Tanggal Transaksi</Label>
            <Input
              value={format(new Date(transaksi.tanggal), "dd-MM-yyyy")}
              disabled
            />
          </div>
          <div>
            <Label>Total</Label>
            <Input value={rupiahFormat(Number(transaksi.total))} disabled />
          </div>
          <div>
            <Label>Sudah Dibayar</Label>
            <Input value={rupiahFormat(Number(transaksi.dibayar))} disabled />
          </div>
          <div>
            <Label>Sisa Piutang</Label>
            <Input
              value={rupiahFormat(Number(transaksi.sisa_piutang))}
              disabled
            />
          </div>
          <div>
            <Label>Jumlah Pembayaran</Label>
            <Input
              type="number"
              value={jumlahBayar}
              onChange={(e) => setJumlahBayar(e.target.value)}
              max={parseFloat(transaksi.sisa_piutang)}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={() => setOpenConfirm(true)}>Lunasi Sekarang</Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={openConfirm}
        title="Konfirmasi Pelunasan"
        message="Yakin ingin menyimpan pelunasan ini?"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={handleSubmit}
      />
    </Dialog>
  );
}
