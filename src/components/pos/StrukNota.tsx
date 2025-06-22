// src/components/pos/StrukNota.tsx
import React, { forwardRef } from "react";
import type { KeranjangItem } from "@/types/pos";
import { rupiahFormat } from "@/utils/formatting";

interface Props {
  payload: {
    tanggal: string;
    customer: string;
    total: number;
    ongkir: number;
    dibayar: number;
    kembali: number;
    sisa_piutang: number;
    status: string;
    user_id: number;
    username?: string;
    detail: KeranjangItem[];
  };
}

const StrukNota = forwardRef<HTMLDivElement, Props>(({ payload }, ref) => {
  // if (!payload) return null;
  const {
    tanggal,
    customer,
    total,
    ongkir,
    dibayar,
    kembali,
    sisa_piutang,
    detail,
  } = payload;

  const username = JSON.parse(localStorage.getItem("auth-storage") || "{}")
    ?.state?.user?.username;

  return (
    <div
      ref={ref}
      className="w-[300px] mx-auto text-xs font-mono print:w-full print:text-sm"
    >
      {/* Kop Toko */}
      <div className="text-center mb-2 border-b pb-2">
        <h1 className="text-base font-bold uppercase">
          TOKO BANGUNAN MAJU JAYA
        </h1>
        <p className="text-xs">Jl. Raya Bangunan No. 123, Palu</p>
      </div>

      {/* Info Umum */}
      <div className="mb-2">
        <p>Tanggal : {tanggal}</p>
        <p>Customer : {customer}</p>
        <p>Kasir : {username}</p>
        <p>Status : {rupiahFormat(sisa_piutang) > 0 ? "Hutang" : "Lunas"}</p>
      </div>

      {/* Tabel Barang */}
      <table className="w-full mb-2">
        <thead>
          <tr className="border-t border-b">
            <th align="left">Barang</th>
            <th align="right">Qty</th>
            <th align="right">Harga</th>
            <th align="right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detail.map((item, i) => (
            <tr key={i}>
              <td>{item.nama_barang}</td>
              <td align="right">
                {item.qty} {item.nama_satuan}
              </td>
              <td align="right">{rupiahFormat(+item.harga_jual)}</td>
              <td align="right">{rupiahFormat(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total dan Pembayaran */}
      <div className="space-y-1 border-t pt-1">
        <div className="flex justify-between">
          <span>Total</span>
          <span>Rp{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Ongkir</span>
          <span>{rupiahFormat(ongkir)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Grand Total</span>
          <span>{rupiahFormat(total + ongkir)}</span>
        </div>
        <div className="flex justify-between">
          <span>Dibayar</span>
          <span>{rupiahFormat(dibayar)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kembali</span>
          <span>{rupiahFormat(Math.max(kembali, 0))}</span>
        </div>
        {sisa_piutang > 0 && (
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Sisa Piutang</span>
            <span>{rupiahFormat(sisa_piutang.toLocaleString)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-4 text-[10px] italic">
        --- Terima Kasih Telah Berbelanja ---
      </div>
    </div>
  );
});

StrukNota.displayName = "StrukNota";
export default StrukNota;
