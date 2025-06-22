// src/components/pos/StrukPreview.tsx
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

interface Props {
  data: unknown; // payload transaksi
}

export default function StrukPreview({ data }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // trigger saat pertama kali render
  useEffect(() => {
    setIsReady(true);
  }, []);

  const print = () => {
    setTimeout(() => {
      if (ref.current) {
        handlePrint();
      }
    }, 300);
  };

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: `Struk_${data.tanggal}`,
    removeAfterPrint: true,
  });

  const tglFormatted = format(new Date(data.tanggal), "EEEE, dd MMMM yyyy", {
    locale: id,
  });

  return (
    <div className="space-y-4">
      <div
        ref={ref}
        className="bg-white p-4 text-black text-xs max-w-sm mx-auto"
        suppressHydrationWarning
      >
        <div className="text-center font-bold text-sm uppercase">
          TOKO BANGUNAN MAKMUR JAYA
        </div>
        <div className="text-center text-[10px] mb-2">
          Jl. Poros Palu - Donggala KM.10, Kec. Labuan, Kota Palu
        </div>

        <hr className="my-1" />

        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>{tglFormatted}</span>
        </div>
        <div className="flex justify-between">
          <span>Kasir</span>
          <span>{data.user?.username || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Pelanggan</span>
          <span>{data.customer}</span>
        </div>
        <div className="flex justify-between">
          <span>Status</span>
          <span>{data.sisa_piutang > 0 ? "Hutang" : "Lunas"}</span>
        </div>

        <hr className="my-1" />

        {data.detail.map((item: unknown, idx: number) => (
          <div key={idx} className="flex justify-between">
            <div>
              {item.nama_barang} ({item.nama_satuan}) x {item.qty}
            </div>
            <div>Rp{item.subtotal.toLocaleString()}</div>
          </div>
        ))}

        <hr className="my-1" />

        <div className="flex justify-between">
          <span>Total</span>
          <span>Rp{data.total.toLocaleString()}</span>
        </div>

        {data.ongkir > 0 && (
          <div className="flex justify-between">
            <span>Ongkir</span>
            <span>Rp{data.ongkir.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Dibayar</span>
          <span>Rp{data.dibayar.toLocaleString()}</span>
        </div>

        {data.sisa_piutang > 0 ? (
          <div className="flex justify-between">
            <span>Sisa Piutang</span>
            <span>Rp{data.sisa_piutang.toLocaleString()}</span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span>Kembali</span>
            <span>Rp{data.kembali.toLocaleString()}</span>
          </div>
        )}

        <hr className="my-2" />
        <div className="text-center text-[10px] italic">
          Terima kasih atas kunjungan Anda!
        </div>
      </div>

      <div className="text-center">
        <Button onClick={print}>Cetak Struk</Button>
      </div>
    </div>
  );
}
