import { forwardRef } from "react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { rupiahFormat } from "@/utils/formatting";

interface Props {
  transaksi: undefined;
  detail: undefined[];
  isPrint?: boolean;
}

export const StrukNota = forwardRef<HTMLDivElement, Props>(
  ({ transaksi, detail }, ref) => {
    const tanggalObj = parse(
      transaksi?.tanggal,
      "yyyy-MM-dd HH:mm:ss",
      new Date()
    );

    return (
      <div ref={ref} className="font-mono text-sm p-4 space-y-2 w-[300px]">
        <div className="text-center">
          <h1 className="text-base font-bold uppercase">
            Buana Situju Dapurang
          </h1>
          <p>{format(tanggalObj, "eeee, dd MMMM yyyy", { locale: id })}</p>
          <p>Jam {format(tanggalObj, "HH:mm")}</p>
        </div>

        <div>
          <p>No Nota: {transaksi.no_nota}</p>
          <p>Customer: {transaksi.customer}</p>
          <p>Kasir: {transaksi.username}</p>
          <p>Status: {transaksi.status}</p>
        </div>

        <hr />

        <div>
          {detail.map((item, idx) => (
            <div key={idx} className="mb-1">
              <div>{item.nama_barang}</div>
              <div className="flex justify-between">
                <span>
                  {item.qty} {item.nama_satuan} x{" "}
                  {rupiahFormat(item.harga_jual)}
                </span>
                <span>{rupiahFormat(item.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div>
          <div className="flex justify-between">
            <span>Total</span>
            <span>{rupiahFormat(transaksi.total)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkir</span>
            <span>{rupiahFormat(transaksi.ongkir)}</span>
          </div>
          <div className="flex justify-between">
            <span>Dibayar</span>
            <span>{rupiahFormat(transaksi.dibayar)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kembali</span>
            <span>{rupiahFormat(transaksi.kembali)}</span>
          </div>
          {parseFloat(transaksi.sisa_piutang) > 0 && (
            <div className="flex justify-between">
              <span>Sisa Piutang</span>
              <span>{rupiahFormat(transaksi.sisa_piutang)}</span>
            </div>
          )}
        </div>

        <hr />
        <p className="text-center mt-2">Terima kasih telah berbelanja 🙏</p>
      </div>
    );
  }
);

StrukNota.displayName = "StrukNota";
