// src/pages/transaksi/types.ts
export type TransaksiJual = {
  id: string|null;
  tanggal: string |undefined |null;
  supplier_id: string |undefined |null;
  total: string |undefined |null;
  dibayar: string |undefined |null;
  sisa_hutang: string |undefined |null;
  status: "Lunas" | "Piutang";
  username: string |undefined |null;
  no_nota:string |undefined |null;
  customer:string |undefined |null;
  ongkir:string |undefined |null;
  diskon:string |undefined |null;
  kembali:string |undefined |null;
  sisa_piutang:string |undefined |null;
  user_id:string |undefined |null;
};
