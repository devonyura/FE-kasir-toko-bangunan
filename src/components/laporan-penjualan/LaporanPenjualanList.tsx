// src/components/laporan/LaporanPenjualanList.tsx

import type { TransaksiJual } from "@/components/transaksi-jual/types";
import { rupiahFormat } from "@/utils/formatting";

interface Props {
  data: TransaksiJual[];
}

export default function LaporanPenjualanList({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Tidak ada data penjualan.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((trx) => (
        <div
          key={trx.no_nota}
          className="p-4 rounded border shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
        >
          <div className="text-sm">
            <p className="font-semibold">{trx.no_nota}</p>
            <p className="text-muted-foreground">
              {trx.tanggal} &bull; {trx.customer}
            </p>
          </div>
          <div className="text-right space-y-1 text-sm">
            <p>
              Total:{" "}
              <span className="font-semibold">
                {rupiahFormat(trx.total ?? 0)}
              </span>
            </p>
            <p>Dibayar: {rupiahFormat(trx.dibayar ?? 0)}</p>
            <p
              className={
                trx.status === "Lunas"
                  ? "text-green-600 font-medium"
                  : "text-orange-600 font-medium"
              }
            >
              Status: {trx.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
