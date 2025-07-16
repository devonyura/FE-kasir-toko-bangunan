// src/components/pos/PanelPembayaran.tsx

import { useEffect, useState } from "react";
import CurrencyInput from "@/components/ui/CurrencyInput"; // ✅ Import baru
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { axiosInstance } from "@/utils/axios";
import type { KeranjangItem } from "@/types/pos";
import { rupiahFormat } from "@/utils/formatting";
import { Checkbox } from "@/components/ui/checkbox";
import { addDays } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea"

interface Props {
  keranjang: KeranjangItem[];
  onSuccess: () => void;
  onCetak: (notaId: string) => void;
}

export default function PanelPembayaran({
  keranjang,
  onSuccess,
  onCetak,
}: Props) {
  const [totalBarang, setTotalBarang] = useState(0);
  const [bayar, setBayar] = useState("");
  const [kembali, setKembali] = useState(0);
  const [ongkir, setOngkir] = useState("");
  const [isOngkir, setIsOngkir] = useState("Tidak");
  const [status, setStatus] = useState<"Lunas" | "Piutang">("Lunas");
  const [customer, setCustomer] = useState("Umum");
  const [keterangan, setKeterangan] = useState("");
  const [jatuhTempo, setJatuhTempo] = useState(
    format(addDays(new Date(), 1), "yyyy-MM-dd")
  );
  const [openConfirm, setOpenConfirm] = useState(false);
  const [error, setError] = useState("");

  const [isDiskon, setIsDiskon] = useState(false);
  const [diskon, setDiskon] = useState("");

  const ongkirNum = parseFloat(ongkir) || 0;
  const bayarNum = parseFloat(bayar) || 0;
  const diskonNum = parseFloat(diskon) || 0;
  const totalFinal =
    totalBarang - (isDiskon ? diskonNum : 0) + (isOngkir === "Ya" ? ongkirNum : 0);
  const sisaPiutang = status === "Piutang" ? totalFinal - bayarNum : 0;

  useEffect(() => {
    const total = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalBarang(total);
  }, [keranjang]);

  useEffect(() => {
    setKembali(bayarNum > totalFinal ? bayarNum - totalFinal : 0);
  }, [bayar, totalFinal, bayarNum]);

  const handleSubmit = async () => {
    if (keranjang.length === 0) {
      setError("Keranjang kosong.");
      return;
    }

    if (status === "Lunas" && bayarNum < totalFinal) {
      setError("Jumlah bayar tidak mencukupi untuk status Lunas.");
      return;
    }

    const userId = JSON.parse(localStorage.getItem("auth-storage") || "{}")
      ?.state?.user?.id;

    const timeZone = "Asia/Shanghai";
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    const tanggalLengkap = format(zonedDate, "yyyy-MM-dd HH:mm:ss", {
      timeZone,
    });

    const payload = {
      tanggal: tanggalLengkap,
      customer: customer || "Umum",
      total: totalFinal,
      ongkir: isOngkir === "Ya" ? ongkirNum : 0,
      diskon: isDiskon ? diskonNum : 0,
      dibayar: bayarNum,
      kembali: status === "Lunas" ? kembali : 0,
      sisa_piutang: sisaPiutang,
      status,
      jatuh_tempo: status === "Piutang" ? jatuhTempo : tanggalLengkap,
      user_id: Number(userId),
      keterangan: keterangan,
      detail: keranjang.map((item) => ({
        barang_id: Number(item.barang_id),
        tipe_id: Number(item.tipe_id),
        qty: item.qty,
        harga_jual: Number(item.harga_jual),
        subtotal: item.subtotal,
      })),
    };
    console.log("payload PanelPembayaran:", payload);
    try {
      const res = await axiosInstance.post("/transaksi-jual", payload);
      const noNota = res.data.data.no_nota;
      onSuccess();
      onCetak(noNota);
      setBayar("");
      setKembali(0);
      setOngkir("");
      setIsDiskon(false);
      setIsOngkir("Tidak");
      setStatus("Lunas");
      setError("");
      setCustomer("Umum");
      setKeterangan("");
      setJatuhTempo(new Date().toISOString().split("T")[0]);
    } catch (errs) {
      if (axios.isAxiosError(errs)) {
        const msg =
          errs?.response?.data?.messages?.error || "Gagal menyimpan retur.";
        setError(msg);
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      <div className="border rounded p-4 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold">Pembayaran</h2>

        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-5 w-5" />
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm">
          <div>
            <Label className="mb-1">Nama Customer</Label>
            <Input
              placeholder="Umum"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Status Transaksi</Label>
            <RadioGroup
              value={status}
              onValueChange={(val) => setStatus(val as "Lunas" | "Piutang")}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Lunas" id="lunas" />
                <Label htmlFor="lunas">Lunas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Piutang" id="Piutang" />
                <Label htmlFor="Piutang">Piutang</Label>
              </div>
            </RadioGroup>
          </div>

          {status === "Piutang" && (
            <div>
              <Label className="mb-1">Jatuh Tempo</Label>
              <Input
                type="date"
                value={jatuhTempo}
                onChange={(e) => setJatuhTempo(e.target.value)}
              />
            </div>
          )}

          <div>
            <Label className="mb-1">Ongkos Kirim?</Label>
            <RadioGroup
              value={isOngkir}
              onValueChange={setIsOngkir}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Ya" id="ya" />
                <Label htmlFor="ya">Ya</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Tidak" id="tidak" />
                <Label htmlFor="tidak">Tidak</Label>
              </div>
            </RadioGroup>
          </div>

          {isOngkir === "Ya" && (
            <div>
              <Label className="mb-1">Biaya Ongkir</Label>
              <CurrencyInput value={ongkir} onChange={setOngkir} />
            </div>
          )}

          {isOngkir === "Ya" && (
            <div className="flex justify-between items-center">
              <Label className="mb-1">Subtotal</Label>
              <p className="font-semibold">Rp {totalBarang.toLocaleString()}</p>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox-diskon"
                checked={isDiskon}
                onCheckedChange={(val) => setIsDiskon(!!val)}
              />
              <Label htmlFor="checkbox-diskon">Diskon</Label>
            </div>

            {isDiskon && (
              <div className="mt-1">
                <CurrencyInput value={diskon} onChange={setDiskon} />
                <p className="text-xs text-muted-foreground mt-1">
                  Diskon:{" "}
                  {Math.round(((parseFloat(diskon) || 0) / totalBarang) * 100)}%
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Label className="mb-1">Total</Label>
            <p className="text-lg font-bold text-foreground">
              {rupiahFormat(totalFinal)}
            </p>
          </div>

          <div>
            <Label className="mb-1">Bayar</Label>
            <CurrencyInput value={bayar} onChange={setBayar} />
          </div>

          {status === "Piutang" && (
            <div className="text-sm text-red-600 font-semibold mt-1">
              Sisa Piutang: {rupiahFormat(sisaPiutang)}
            </div>
          )}

          <div className="flex justify-between items-center">
            <Label className="mb-1">Kembali</Label>
            <p className="font-semibold">
              {kembali > 0 ? rupiahFormat(kembali) : "0"}
            </p>
          </div>
          <div>
            <Label className="mb-1">Keterangan</Label>
            <Textarea
              placeholder="isi alamat, no rekening jika transfer bank info lainya."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />
          </div>
        </div>

        <Button className="w-full" onClick={() => setOpenConfirm(true)}>
          Simpan & Cetak
        </Button>
      </div>
      <ConfirmDialog
        open={openConfirm}
        title="Simpan Transaksi?"
        message="Data transaksi yang sudah disimpan tidak bisa dihapus."
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => {
          setOpenConfirm(false);
          handleSubmit();
        }}
      />
    </>
  );
}
