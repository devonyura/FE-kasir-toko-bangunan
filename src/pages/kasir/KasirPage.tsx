import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CariBarangAutocomplete from "@/components/pos/CariBarangAutocomplete";
import TabelKeranjang from "@/components/pos/TabelKeranjang";
import PanelPembayaran from "@/components/pos/PanelPembayaran";
import { axiosInstance } from "@/utils/axios";
import type { KeranjangItem, Barang, Satuan } from "@/types/pos";

export default function KasirPage() {
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);

  const handleTambahBarang = async (barang: Barang) => {
    // Jika barang sudah ada → focus ke qty (bisa dikembangkan nanti)
    const sudahAda = keranjang.some((item) => item.barang_id === barang.id);
    if (sudahAda) return;

    try {
      const res = await axiosInstance.get(`/satuan-barang/barang/${barang.id}`);
      const semuaSatuan: Satuan[] = res.data.data || [];

      const satuanDefault = semuaSatuan.find(
        (s) => s.id === barang.satuan_default.id
      );

      if (!satuanDefault) return;

      const itemBaru: KeranjangItem = {
        barang_id: barang.id,
        nama_barang: barang.nama_barang,
        satuan_id: satuanDefault.id,
        nama_satuan: satuanDefault.nama_satuan,
        qty: 1,
        harga_jual: satuanDefault.harga_jual,
        subtotal: satuanDefault.harga_jual * 1,
        semua_satuan: semuaSatuan,
      };

      setKeranjang((prev) => [...prev, itemBaru]);
    } catch (err) {
      console.error("Gagal mengambil satuan barang:", err);
    }
  };

  const handleUpdateItem = (index: number, updated: KeranjangItem) => {
    setKeranjang((prev) =>
      prev.map((item, i) => (i === index ? updated : item))
    );
  };

  const handleDeleteItem = (index: number) => {
    setKeranjang((prev) => prev.filter((_, i) => i !== index));
  };

  const resetKeranjang = () => {
    setKeranjang([]);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">Transaksi Penjualan (POS)</h1>

      <CariBarangAutocomplete onSelectBarang={handleTambahBarang} />

      <Separator />

      <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
        <TabelKeranjang
          items={keranjang}
          onUpdate={handleUpdateItem}
          onDelete={handleDeleteItem}
        />
        <PanelPembayaran keranjang={keranjang} onSuccess={resetKeranjang} />
      </div>
    </div>
  );
}
