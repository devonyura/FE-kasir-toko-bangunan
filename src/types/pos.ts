// src/types/pos.ts

// Barang dasar
export interface Barang {
  id: string;
  nama_barang: string;
  kode_barang: string;
  nama_kategori: string;
}

// Satuan barang
export interface SatuanBarang {
  id: string;
  nama_satuan: string;
  harga_jual: number;
  konversi_ke_satuan_dasar: number;
  is_satuan_default: boolean;
}

// Item keranjang (cart)
export interface KeranjangItem {
  barang_id: string;
  nama_barang: string;
  satuan_id: string;
  nama_satuan: string;
  qty: number;
  harga_jual: number;
  subtotal: number;
}

// Detail transaksi jual (untuk kirim ke backend)
export interface DetailTransaksiJual {
  barang_id: number;
  satuan_id: number;
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
