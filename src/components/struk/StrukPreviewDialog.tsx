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
    transaksi: undefined;
    detail: undefined[];
  };
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
  const getHarga = (item: unknown) =>
    parseFloat(item?.harga_jual ?? item?.harga_beli ?? 0);
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

              {/* Kondisional: Kembali atau Sisa Hutang */}
              {isPenjualan ? (
                <>
                  <div className="flex justify-between">
                    <span>Kembali</span>
                    <span>{rupiahFormat(transaksi.kembali)}</span>
                  </div>
                  {parseFloat(transaksi.sisa_piutang || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>Sisa Piutang</span>
                      <span>{rupiahFormat(transaksi.sisa_piutang)}</span>
                    </div>
                  )}
                </>
              ) : (
                parseFloat(transaksi.sisa_hutang || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Sisa Hutang</span>
                    <span>{rupiahFormat(transaksi.sisa_hutang)}</span>
                  </div>
                )
              )}
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
          className="font-mono text-sm p-4 max-w-xs mx-auto ml-14"
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

            {isPenjualan ? (
              <>
                <div className="flex justify-between">
                  <span>Kembali</span>
                  <span>{rupiahFormat(transaksi.kembali)}</span>
                </div>
                {parseFloat(transaksi.sisa_piutang || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Sisa Piutang</span>
                    <span>{rupiahFormat(transaksi.sisa_piutang)}</span>
                  </div>
                )}
              </>
            ) : (
              parseFloat(transaksi.sisa_hutang || 0) > 0 && (
                <div className="flex justify-between">
                  <span>Sisa Hutang</span>
                  <span>{rupiahFormat(transaksi.sisa_hutang)}</span>
                </div>
              )
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
