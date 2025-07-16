import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { rupiahFormat, singkatNamaBarang } from "@/utils/formatting";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: {
    transaksi: Transaksi;
    detail: DetailTransaksi[];
  } | null;
}

interface Transaksi {
  no_nota: string;
  tanggal: string;
  customer?: string;
  nama_supplier?: string;
  username: string;
  status: string;
  ongkir: number;
  diskon: number;
  total: number;
  dibayar: number;
  kembali?: number;
  jatuh_tempo?: string;
  keterangan?: string;
  sisa_piutang?: number;
  sisa_hutang?: number;
}

interface DetailTransaksi {
  nama_barang: string;
  nama_tipe: string;
  qty: number;
  harga_jual?: number;
  harga_beli?: number;
  subtotal: number;
}

export default function StrukPreviewDialog({
  open,
  onOpenChange,
  data,
}: Props) {
  const [showPrintArea, setShowPrintArea] = useState(false);
  const handlePrint = () => {
    setShowPrintArea(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintArea(false), 500);
    }, 300);
  };

  if (!data) return null;

  const { transaksi, detail } = data;

  const isPenjualan = transaksi?.no_nota?.startsWith("NJ");
  const tanggalObj = parse(
    transaksi?.tanggal,
    "yyyy-MM-dd HH:mm:ss",
    new Date()
  );

  // helper untuk ambil harga (jual atau beli)
  const getHarga = (item: unknown) => {
    if (
      typeof item === "object" &&
      item !== null &&
      ("harga_jual" in item || "harga_beli" in item)
    ) {
      const cast = item as DetailTransaksi;
      return parseFloat((cast.harga_jual ?? cast.harga_beli ?? 0).toString());
    }
    return 0;
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-[380px] print:hidden max-h-screen overflow-auto"
          aria-describedby=""
        >
          <DialogHeader>
            <DialogTitle>Preview Struk</DialogTitle>
          </DialogHeader>

          <div className="font-mono text-sm p-4 space-y-2">
            <div className="text-center">
              <h1 className="text-base font-bold uppercase">
                Buana Situju Dapurang
              </h1>
              <p>{format(tanggalObj, "eeee, dd MMMM yyyy", { locale: id })}</p>
              <p>Jam {format(tanggalObj, "HH:mm")}</p>
            </div>

            <div>
              <p>No Nota: {transaksi.no_nota}</p>
              <p>
                {isPenjualan ? "Customer" : "Supplier"}:{" "}
                {transaksi.customer || transaksi.nama_supplier}
              </p>
              <p>Kasir: {transaksi.username}</p>
              <p>
                Status:{" "}
                {transaksi.status === "Piutang"
                  ? "Belum Lunas"
                  : transaksi.status}
              </p>
            </div>

            <hr />

            <div>
              {detail.map((item, idx) => (
                <div key={idx} className="mb-1">
                  <div>
                    {singkatNamaBarang(item.nama_barang)} - {item.nama_tipe}
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {item.qty} x {rupiahFormat(getHarga(item))}
                    </span>
                    <span>{rupiahFormat(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <hr />

            <div>
              <div className="flex justify-between">
                <span>Ongkir</span>
                <span>{rupiahFormat(Number(transaksi.ongkir))}</span>
              </div>
              <div className="flex justify-between">
                <span>Diskon</span>
                <span>-{rupiahFormat(Number(transaksi.diskon))}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>{rupiahFormat(transaksi.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dibayar</span>
                <span>{rupiahFormat(transaksi.dibayar)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembali</span>
                <span>{rupiahFormat(transaksi.kembali ?? 0)}</span>
              </div>

              {/* Kondisional: Kembali atau Sisa Hutang */}
              {isPenjualan ? (
                <>
                  {parseFloat((transaksi.sisa_piutang ?? 0).toString()) > 0 && (
                    <div className="flex justify-between">
                      <span>Sisa Piutang</span>
                      <span>{rupiahFormat(transaksi.sisa_piutang ?? 0)}</span>
                    </div>
                  )}
                </>
              ) : (
                parseFloat((transaksi.sisa_hutang ?? 0).toString()) > 0 && (
                  <div className="flex justify-between">
                    <span>Sisa Hutang</span>
                    <span>{rupiahFormat(transaksi.sisa_hutang ?? 0)}</span>
                  </div>
                )
              )}
              {/* Tampilkan jatuh tempo jika status != Lunas */}
              {transaksi.status !== "Lunas" && transaksi.jatuh_tempo && (
                <div className="flex justify-between">
                  <span>Jatuh Tempo</span>
                  <span>
                    {format(new Date(transaksi.jatuh_tempo), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </span>
                </div>
              )}
            </div>
            <hr />
            <div>
              Keterangan: {transaksi.keterangan}
            </div>
            <hr />
            <p className="text-center mt-2">
              {isPenjualan
                ? "Terima kasih telah berbelanja 🙏"
                : "Ini adalah catatan pembelian stok"}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Kembali
            </Button>
            <Button onClick={handlePrint}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AREA CETAK */}
      {showPrintArea && (
        <div
          id="area-print-struk"
          className="font-mono text-sm p-4 max-w-xs mx-auto ml-12"
        >
          <div className="text-center">
            <h1 className="text-base font-bold uppercase">
              Buana Situju Dapurang
            </h1>
            <p>{format(tanggalObj, "eeee, dd MMMM yyyy", { locale: id })}</p>
            <p>Jam {format(tanggalObj, "HH:mm")}</p>
          </div>

          <div className="mt-2">
            <p>No Nota: {transaksi.no_nota}</p>
            <p>
              {isPenjualan ? "Customer" : "Supplier"}:{" "}
              {transaksi.customer || transaksi.nama_supplier}
            </p>
            <p>Kasir: {transaksi.username}</p>
            <p>Status: {transaksi.status}</p>
          </div>

          <hr className="my-2" />

          <div>
            {detail.map((item, idx) => (
              <div key={idx} className="mb-1">
                <div>
                  {singkatNamaBarang(item.nama_barang)} - {item.nama_tipe}
                </div>
                <div className="flex justify-between">
                  <span>
                    {item.qty} x {rupiahFormat(getHarga(item))}
                  </span>
                  <span>{rupiahFormat(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-2" />

          <div>
            <div className="flex justify-between">
              <span>Ongkir</span>
              <span>{rupiahFormat(Number(transaksi.ongkir))}</span>
            </div>
            <div className="flex justify-between">
              <span>Diskon</span>
              <span>-{rupiahFormat(Number(transaksi.diskon))}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span>{rupiahFormat(transaksi.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dibayar</span>
              <span>{rupiahFormat(transaksi.dibayar)}</span>
            </div>

            <div className="flex justify-between">
              <span>Kembali</span>
              <span>{rupiahFormat(transaksi.kembali ?? 0)}</span>
            </div>
            {isPenjualan ? (
              <>
                {parseFloat((transaksi.sisa_piutang ?? 0).toString()) > 0 && (
                  <div className="flex justify-between">
                    <span>Sisa Piutang</span>
                    <span>{rupiahFormat(transaksi.sisa_piutang ?? 0)}</span>
                  </div>
                )}
              </>
            ) : (
              parseFloat((transaksi.sisa_hutang ?? 0).toString()) > 0 && (
                <div className="flex justify-between">
                  <span>Sisa Hutang</span>
                  <span>{rupiahFormat(transaksi.sisa_hutang ?? 0)}</span>
                </div>
              )
            )}
            {transaksi.status !== "Lunas" && transaksi.jatuh_tempo && (
              <div className="flex justify-between">
                <span>Jatuh Tempo</span>
                <span>
                  {format(new Date(transaksi.jatuh_tempo), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
            )}
          </div>

          <hr className="my-2" />
          <p className="text-center mt-2">
            {isPenjualan
              ? "Terima kasih telah berbelanja 🙏"
              : "Ini adalah catatan pembelian stok"}
          </p>
        </div>
      )}
    </>
  );
}
