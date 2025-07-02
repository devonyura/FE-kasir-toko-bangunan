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
import { rupiahFormat } from "@/utils/formatting";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [customer, setCustomer] = useState("Umum"); // ✅ TAMBAH INI

  const [error, setError] = useState("");

  const [isDiskon, setIsDiskon] = useState(false);
  const [diskon, setDiskon] = useState("");

  const ongkirNum = parseFloat(ongkir) || 0;
  const bayarNum = parseFloat(bayar) || 0;
  const diskonNum = parseFloat(diskon) || 0;
  const totalFinal =
    totalBarang -
    (isDiskon ? diskonNum : 0) +
    (isOngkir === "Ya" ? ongkirNum : 0);
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

    // Format tanggal ke "YYYY-MM-DD HH:mm:ss"
    const tanggal = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const jamSekarang = now.toTimeString().split(" ")[0]; // contoh: "21:47:22"
    const tanggalLengkap = `${tanggal} ${jamSekarang}`;

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
      user_id: Number(userId),
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
      console.log("respon:", res.data);
      const noNota = res.data.data.no_nota;
      console.log("noNota:", noNota);
      // printStrukCustom(payload);
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
    } catch (err) {
      if (err) {
        // `const msg =
        //   err?.response?.data?.message ||
        //   err?.response?.data?.messages?.error ||
        //   "Gagal menyimpan transaksi.";
        // setError(msg);`
      }
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000); // tampil 3 detik
      return () => clearTimeout(timer); // bersihkan timer saat unmount/change
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

          {/* Ongkir */}
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
              <Input
                type="number"
                value={ongkir}
                onChange={(e) => setOngkir(e.target.value)}
              />
            </div>
          )}
          {isOngkir === "Ya" && (
            <div className="flex justify-between items-center">
              <Label className="mb-1">Subtotal</Label>
              <p className="font-semibold">Rp {totalBarang.toLocaleString()}</p>
            </div>
          )}

          {/* Diskon */}
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
                <Input
                  type="number"
                  placeholder="Masukkan nominal diskon"
                  value={diskon}
                  onChange={(e) => setDiskon(e.target.value)}
                />
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
            <Input
              type="number"
              value={bayar}
              onChange={(e) => setBayar(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <Label className="mb-1">Kembali</Label>
            <p className="font-semibold">
              {kembali > 0 ? rupiahFormat(kembali) : "0"}
            </p>
          </div>
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Simpan & Cetak
        </Button>
      </div>
    </>
  );
}
