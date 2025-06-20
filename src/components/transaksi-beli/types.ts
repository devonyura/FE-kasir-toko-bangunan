// src/pages/transaksi/types.ts
export type TransaksiBeli = {
  id: string;
  tanggal: string;
  supplier_id: string;
  total: string;
  dibayar: string;
  sisa_hutang: string;
  status: "Lunas" | "Hutang";
  user_id: string;
  nama_supplier: string;
  username: string;
};
