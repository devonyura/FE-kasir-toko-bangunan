// src/types/pos.ts

// Barang dasar
export interface Barang {
  id: string;
  nama_barang: string;
  kode_barang: string;
  nama_kategori: string;
}

// Tipe barang
export interface TipeBarang {
  id: string;
  nama_tipe: string;
  harga_jual: number;
  konversi_ke_tipe_dasar: number;
  is_tipe_default: boolean;
}

// Item keranjang (cart)
// export interface KeranjangItem {
//   barang_id: string;
//   nama_barang: string;
//   tipe_id: string;
//   nama_tipe: string;
//   qty: number;
//   harga_jual: number;
//   subtotal: number;
// }

export interface Tipe {
  id: string;
  nama_tipe: string;
  harga_jual: number;
}

export interface KeranjangItem {
  barang_id: string;
  nama_barang: string;
  tipe_id: string;
  nama_tipe: string;
  qty: number;
  harga_jual: number;
  subtotal: number;
  semua_tipe: Tipe[]; // 🆕 untuk dropdown tipe
}

// Detail transaksi jual (untuk kirim ke backend)
export interface DetailTransaksiJual {
  barang_id: number;
  tipe_id: number;
  qty: number;
  harga: number;
  subtotal: number;
}

// Transaksi jual keseluruhan
export interface TransaksiJual {
  id: number;
  tanggal: string;
  total: number;
  bayar: number;
  kembali: number;
  detail: DetailTransaksiJual[];
}
