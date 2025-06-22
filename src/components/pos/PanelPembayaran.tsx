// src/components/pos/Panel.pembayaran.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { axiosInstance } from "@/utils/axios";
import type { KeranjangItem } from "@/types/pos";
import { printStrukCustom } from "@/components/pos/StrukManualThermalLanscape";

interface Props {
  keranjang: KeranjangItem[];
  onSuccess: () => void;
}

export default function PanelPembayaran({ keranjang, onSuccess }: Props) {
  const [totalBarang, setTotalBarang] = useState(0);
  const [bayar, setBayar] = useState("");
  const [kembali, setKembali] = useState(0);
  const [ongkir, setOngkir] = useState("");
  const [isOngkir, setIsOngkir] = useState("Tidak");
  const [status, setStatus] = useState<"Lunas" | "Piutang">("Lunas");
  const [customer, setCustomer] = useState("Umum"); // ✅ TAMBAH INI
  // const [strukData, setStrukData] = useState<unknown | null>(null);

  const [error, setError] = useState("");

  const ongkirNum = parseFloat(ongkir) || 0;
  const bayarNum = parseFloat(bayar) || 0;
  const totalFinal = totalBarang + (isOngkir === "Ya" ? ongkirNum : 0);
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

    const payload = {
      tanggal: new Date().toISOString().slice(0, 10),
      customer: customer || "Umum",
      total: totalFinal,
      ongkir: isOngkir === "Ya" ? ongkirNum : 0,
      dibayar: bayarNum,
      kembali: status === "Lunas" ? kembali : 0,
      sisa_piutang: sisaPiutang,
      status,
      user_id: Number(userId),
      detail: keranjang.map((item) => ({
        barang_id: Number(item.barang_id),
        satuan_id: Number(item.satuan_id),
        qty: item.qty,
        harga_jual: item.harga_jual,
        subtotal: item.subtotal,
      })),
    };
    console.log("payload:", payload);
    try {
      await axiosInstance.post("/transaksi-jual", payload);
      // setStrukData(payload);
      printStrukCustom(payload);
      onSuccess();
      setBayar("");
      setKembali(0);
      setOngkir("");
      setIsOngkir("Tidak");
      setStatus("Lunas");
      setError("");
    } catch (err: unknown) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.messages?.error ||
        "Gagal menyimpan transaksi.";
      console.log(err);
      setError(msg);
    }
  };
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
            <Label>Nama Customer</Label>
            <Input
              placeholder="Umum"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </div>
          <div>
            <Label>Total</Label>
            <Input value={totalFinal.toLocaleString()} disabled />
          </div>

          <div>
            <Label>Status Transaksi</Label>
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

          {/* Ongkir */}
          <div>
            <Label>Ongkos Kirim?</Label>
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
              <Label>Biaya Ongkir</Label>
              <Input
                type="number"
                value={ongkir}
                onChange={(e) => setOngkir(e.target.value)}
              />
            </div>
          )}

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
            <Input
              value={kembali > 0 ? kembali.toLocaleString() : "0"}
              disabled
            />
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Simpan & Cetak
        </Button>
      </div>
    </>
  );
}
