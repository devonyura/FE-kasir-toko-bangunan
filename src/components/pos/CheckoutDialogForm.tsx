// src/components/pos/CheckoutDialogForm.tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/utils/axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import type { KeranjangItem } from "./FormTambahKeranjangDialog";
import axios from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keranjang: KeranjangItem[];
  onSuccess: () => void;
}

export default function CheckoutDialogForm({
  open,
  onOpenChange,
  keranjang,
  onSuccess,
}: Props) {
  const [bayar, setBayar] = useState("");
  const [kembali, setKembali] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
    setTotal(t);
  }, [keranjang]);

  useEffect(() => {
    const bayarNum = parseFloat(bayar);
    setKembali(!isNaN(bayarNum) ? bayarNum - total : 0);
  }, [bayar, total]);

  const handleSubmit = async () => {
    const bayarNum = parseFloat(bayar);
    if (isNaN(bayarNum) || bayarNum < total) {
      setError("Jumlah bayar tidak cukup.");
      return;
    }

    // Ambil user_id dari localStorage
    const userId = JSON.parse(localStorage.getItem("auth-storage") || "{}")
      ?.state?.user?.id;

    const payload = {
      tanggal: new Date().toISOString().slice(0, 10),
      customer: "Umum", // bisa diganti dinamis nanti
      total,
      dibayar: bayarNum,
      kembali: bayarNum - total,
      sisa_piutang: 0,
      status: "Lunas",
      user_id: Number(userId),
      detail: keranjang.map((item) => ({
        barang_id: Number(item.barang_id),
        satuan_id: Number(item.satuan_id),
        qty: item.qty,
        harga_jual: item.harga_jual,
        subtotal: item.subtotal,
      })),
    };

    console.log("Final payload:", payload);
    try {
      await axiosInstance.post("/transaksi-jual", payload);
      onOpenChange(false);
      onSuccess(); // reset keranjang di luar
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.message;
        setError(msg);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby="">
        <DialogHeader>
          <DialogTitle>Checkout Transaksi</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertCircleIcon className="w-5 h-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm">
          <div className="border rounded p-2 max-h-[200px] overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left">
                  <th>Barang</th>
                  <th>Satuan</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {keranjang.map((item, i) => (
                  <tr key={i}>
                    <td>{item.nama_barang}</td>
                    <td>{item.nama_satuan}</td>
                    <td>{item.qty}</td>
                    <td>{item.harga_jual.toLocaleString()}</td>
                    <td>{item.subtotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <Label>Total</Label>
            <Input value={total.toLocaleString()} disabled />
          </div>
          <div>
            <Label>Bayar</Label>
            <Input
              type="number"
              value={bayar}
              onChange={(e) => setBayar(e.target.value)}
            />
          </div>
          <div>
            <Label>Kembali</Label>
            <Input value={kembali.toLocaleString()} disabled />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit}>
            Simpan Transaksi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
