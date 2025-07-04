import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import CariBarangAutocomplete, {
  type Barang,
} from "@/components/pos/CariBarangAutocomplete";
import TabelKeranjang from "@/components/pos/TabelKeranjang";
import PanelPembayaran from "@/components/pos/PanelPembayaran";
import { axiosInstance } from "@/utils/axios";
import type { KeranjangItem } from "@/types/pos";
import StrukPreviewDialog from "@/components/struk/StrukPreviewDialog";

export default function KasirPage() {
  const [keranjang, setKeranjang] = useState<KeranjangItem[]>([]);
  const [openStruk, setOpenStruk] = useState(false);
  const [dataStruk, setDataStruk] = useState<null | undefined>(null);

  // const handleTambahBarang = async (barang: Barang) => {
  //   try {
  //     const res = await axiosInstance.get(`/tipe-barang/barang/${barang.id}`);
  //     const semuaTipe: Tipe[] = res.data.data || [];

  //     if (semuaTipe.length === 0) {
  //       console.error("Barang tidak memiliki tipe.");
  //       return;
  //     }

  //     // ✅ Cek jika semua tipe stoknya 0
  //     const semuaStokKosong = semuaTipe.every((tipe) => tipe.stok <= 0);
  //     if (semuaStokKosong) {
  //       console.warn("Semua tipe barang stoknya habis.");
  //       alert(
  //         `❌ Stok barang "${barang.nama_barang}" sedang habis di semua tipe.`
  //       );
  //       return;
  //     }

  //     const tipeDefault = semuaTipe[0];

  //     const itemBaru: KeranjangItem = {
  //       barang_id: barang.id,
  //       nama_barang: barang.nama_barang,
  //       tipe_id: tipeDefault.id,
  //       nama_tipe: tipeDefault.nama_tipe,
  //       qty: 1,
  //       harga_jual: tipeDefault.harga_jual,
  //       subtotal: tipeDefault.harga_jual * 1,
  //       semua_tipe: semuaTipe,
  //     };

  //     setKeranjang((prev) => [...prev, itemBaru]);
  //   } catch (err) {
  //     console.error("Gagal mengambil tipe barang:", err);
  //   }
  // };

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

  const handleCetak = async (notaId: string) => {
    if (notaId) {
      try {
        const res = await axiosInstance.get(`/transaksi-jual/${notaId}`);
        setDataStruk(res.data.data);
        setOpenStruk(true);
      } catch (error) {
        console.error("Gagal mengambil data struk", error);
      }
    }
  };

  // const handleSelectBarang = (barang: Barang) => {
  //   // ✅ Jangan lanjutkan jika belum ada tipe_default (belum dipilih)
  //   if (!barang.tipe_default || barang.tipe_default.id === "") return;

  //   const newItem: KeranjangItem = {
  //     barang_id: barang.id,
  //     nama_barang: barang.nama_barang,
  //     tipe_id: barang.tipe_default.id,
  //     nama_tipe: barang.tipe_default.nama_tipe,
  //     qty: 1,
  //     harga_jual: barang.tipe_default.harga_jual,
  //     subtotal: barang.tipe_default.harga_jual,
  //     semua_tipe: barang.semua_tipe,
  //   };

  //   setKeranjang((prev) => [...prev, newItem]);
  // };

  const handleSelectBarang = (barang: Barang) => {
    const tipe = barang.tipe_default;
    if (!tipe || tipe.id === "") return;

    // const key = `${barang.id}-${tipe.id}`;

    setKeranjang((prev) => {
      const index = prev.findIndex(
        (item) => item.barang_id === barang.id && item.tipe_id === tipe.id
      );

      if (index !== -1) {
        // ✅ Jika sudah ada → tambah qty & subtotal
        const updated = [...prev];
        const existing = updated[index];
        const newQty = existing.qty + 1;

        updated[index] = {
          ...existing,
          qty: newQty,
          subtotal: newQty * existing.harga_jual,
        };

        return updated;
      }

      // ✅ Jika belum ada → buat entry baru
      const newItem: KeranjangItem = {
        barang_id: barang.id,
        nama_barang: barang.nama_barang,
        tipe_id: tipe.id,
        nama_tipe: tipe.nama_tipe,
        qty: 1,
        harga_jual: tipe.harga_jual,
        subtotal: tipe.harga_jual,
        semua_tipe: barang.semua_tipe, // agar dropdown tipe di tabel tetap bisa muncul
      };

      return [...prev, newItem];
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
        <div>
          <h1 className="text-lg font-bold mb-3">Transaksi Penjualan (POS)</h1>

          <CariBarangAutocomplete onSelectBarang={handleSelectBarang} />

          <Separator className="mt-3 mb-3" />

          <TabelKeranjang
            items={keranjang}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
          />
        </div>

        <PanelPembayaran
          keranjang={keranjang}
          onSuccess={resetKeranjang}
          onCetak={handleCetak}
        />
      </div>

      <StrukPreviewDialog
        open={openStruk}
        onOpenChange={setOpenStruk}
        data={dataStruk || undefined}
      />
    </div>
  );
}
